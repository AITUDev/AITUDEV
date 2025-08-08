import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const db = await dbConnect();
    const posts = await db.collection('blog_posts').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await dbConnect();
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const featured = formData.get('featured') === 'true';
    const published = formData.get('published') === 'true';
    const images = formData.getAll('images') as File[];

    let imagesData = [];
    
    // Process images if any were uploaded
    if (images && images.length > 0) {
      for (const image of images) {
        try {
          if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;
            
            const uploadResult = await uploadImage(base64);
            imagesData.push({
              url: uploadResult.secure_url,
              publicId: uploadResult.public_id,
            });
          }
        } catch (imageError) {
          console.error('Error uploading image to Cloudinary:', imageError);
          // Continue with other images even if one fails
        }
      }
    }

    // Calculate read time (approximately 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const postData = {
      title,
      content,
      excerpt,
      author,
      category,
      tags,
      featured,
      published,
      images: imagesData,
      readTime: `${readTime} min read`,
      views: 0,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('blog_posts').insertOne(postData);
    const newPost = await db.collection('blog_posts').findOne({ _id: result.insertedId });

    return NextResponse.json({ success: true, data: newPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid ID is required' },
        { status: 400 }
      );
    }

    // Get the post to delete associated image
    const post = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) });
    
    if (post?.images) {
      for (const image of post.images) {
        if (image.publicId) {
          await deleteImage(image.publicId);
        }
      }
    }

    const result = await db.collection('blog_posts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
