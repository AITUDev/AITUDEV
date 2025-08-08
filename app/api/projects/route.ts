import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const db = await dbConnect();
    const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await dbConnect();
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string;
    const progress = parseInt(formData.get('progress') as string) || 0;
    const technologies = JSON.parse(formData.get('technologies') as string || '[]');
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const image = formData.get('image') as File;

    let imageData = undefined;
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;
      
      const uploadResult = await uploadImage(base64);
      imageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const projectData = {
      name,
      description,
      status: status as 'active' | 'completed' | 'paused' | 'cancelled',
      progress,
      technologies,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      githubUrl,
      liveUrl,
      image: imageData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('projects').insertOne(projectData);
    const project = { _id: result.insertedId, ...projectData };
    
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await dbConnect();
    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string;
    const progress = parseInt(formData.get('progress') as string) || 0;
    const technologies = JSON.parse(formData.get('technologies') as string || '[]');
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const image = formData.get('image') as File;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid project ID is required' },
        { status: 400 }
      );
    }

    const existingProject = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    let imageData = existingProject.image;

    // Handle new image upload
    if (image && image.size > 0) {
      // Delete old image if it exists
      if (existingProject.image?.publicId) {
        await deleteImage(existingProject.image.publicId);
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;
      
      const uploadResult = await uploadImage(base64);
      imageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const updateData = {
      name,
      description,
      status: status as 'active' | 'completed' | 'paused' | 'cancelled',
      progress,
      technologies,
      startDate: startDate ? new Date(startDate) : existingProject.startDate,
      endDate: endDate ? new Date(endDate) : null,
      githubUrl,
      liveUrl,
      image: imageData,
      updatedAt: new Date(),
    };

    await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
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
        { success: false, error: 'Valid project ID is required' },
        { status: 400 }
      );
    }

    const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete associated image if it exists
    if (project.image?.publicId) {
      await deleteImage(project.image.publicId);
    }

    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete project' },
        { status: 500 }
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
