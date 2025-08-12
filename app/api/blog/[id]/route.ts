import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { deleteImage } from '@/lib/cloudinary';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid blog post ID' }, { status: 400 });
    }

    const db = await connectToDB();
    const blogCollection = db.collection('blog_posts');
    
    const post = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid blog post ID' }, { status: 400 });
    }

    const formData = await req.formData();
    const db = await connectToDB();
    const blogCollection = db.collection('blog_posts');

    // Get the existing post
    const existingPost = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!existingPost) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      author: formData.get('author') as string,
      category: formData.get('category') as string,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      featured: formData.get('featured') === 'true',
      published: formData.get('published') === 'true',
      updatedAt: new Date()
    };

    // Handle images
    const imagesData = [];
    const newImages = formData.getAll('images') as File[];
    
    // Keep track of existing images that should be preserved
    const existingImages = existingPost.images || [];
    const imagesToKeep = formData.get('existingImages') 
      ? JSON.parse(formData.get('existingImages') as string)
      : [];
      
    // Delete any images that were removed
    if (existingPost) {
      const imagesToDelete = existingImages.filter((img: any) => 
        !imagesToKeep.some((keptImg: any) => keptImg.publicId === img.publicId)
      );

      // Delete images from Cloudinary
      await Promise.all(
        imagesToDelete.map(async (img: any) => {
          try {
            if (img.publicId) {
              await deleteImage(img.publicId);
            }
          } catch (error) {
            console.error(`Failed to delete image ${img.publicId}:`, error);
          }
        })
      );
    }

    // Add existing images that should be kept
    imagesData.push(...existingImages.filter((img: any) => 
      imagesToKeep.some((keptImg: any) => keptImg.publicId === img.publicId)
    ));

    // Process new images if any
    for (const image of newImages) {
      if (image.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append('file', image);
        
        const uploadResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/upload`, {
          method: 'POST',
          body: imageFormData
        });
        
        if (uploadResponse.ok) {
          const { url, publicId } = await uploadResponse.json();
          if (url && publicId) {
            imagesData.push({ url, publicId });
          }
        } else {
          console.error('Failed to upload image:', await uploadResponse.text());
        }
      }
    }

    updateData.images = imagesData;

    // Update the post
    try {
      const result = await blogCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: 'Blog post not found' }, 
          { status: 404 }
        );
      }
      
      // Fetch the updated post to return
      const updatedPost = await blogCollection.findOne({ _id: new ObjectId(id) });
      return NextResponse.json(
        { success: true, data: updatedPost }, 
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error('Error updating blog post:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return NextResponse.json(
        { success: false, message: 'Failed to update blog post', error: errorMessage },
        { status: 500 }
      );
    }

    // // Delete any images that were removed
    // if (existingPost.images) {
    //   for (const img of existingPost.images) {
    //     if (!imagesToKeep.some((keptImg: any) => keptImg.publicId === img.publicId)) {
    //       await deleteImage(img.publicId);
    //     }
    //   }
    // }

    // const updatedPost = await blogCollection.findOne({ _id: new ObjectId(id) });
    // return NextResponse.json({ success: true, data: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}