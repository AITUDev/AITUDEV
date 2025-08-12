import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...project,
        _id: project._id.toString(),
        startDate: project.startDate?.toISOString(),
        endDate: project.endDate?.toISOString(),
        createdAt: project.createdAt?.toISOString(),
        updatedAt: project.updatedAt?.toISOString(),
      } 
    });
    
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    const formData = await request.formData();
    
    const updateData: any = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
      progress: parseInt(formData.get('progress') as string) || 0,
      technologies: JSON.parse(formData.get('technologies') as string || '[]'),
      githubUrl: formData.get('githubUrl') as string,
      liveUrl: formData.get('liveUrl') as string,
      updatedAt: new Date(),
    };

    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const image = formData.get('image') as File;

    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    // Handle image upload if a new image is provided
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;
      
      const { uploadImage } = await import('@/lib/cloudinary');
      const uploadResult = await uploadImage(base64);
      
      updateData.image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const updatedProject = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...updatedProject,
        _id: updatedProject?._id.toString(),
        startDate: updatedProject?.startDate?.toISOString(),
        endDate: updatedProject?.endDate?.toISOString(),
        createdAt: updatedProject?.createdAt?.toISOString(),
        updatedAt: updatedProject?.updatedAt?.toISOString(),
      } 
    });
    
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    
    // Get project first to delete its image from Cloudinary if it exists
    const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (project.image?.publicId) {
      try {
        const { deleteImage } = await import('@/lib/cloudinary');
        await deleteImage(project.image.publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with project deletion even if image deletion fails
      }
    }

    // Delete the project
    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}