import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const db = await dbConnect();
    const teamMembers = await db.collection('teammembers').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await dbConnect();
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const status = formData.get('status') as string;
    const skills = JSON.parse(formData.get('skills') as string || '[]');
    const bio = formData.get('bio') as string;
    const socialLinks = JSON.parse(formData.get('socialLinks') as string || '{}');
    const avatar = formData.get('avatar') as File;

    let avatarData = undefined;
    if (avatar && avatar.size > 0) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${avatar.type};base64,${buffer.toString('base64')}`;
      
      const uploadResult = await uploadImage(base64);
      avatarData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const memberData = {
      name,
      email,
      role,
      status: status as 'active' | 'inactive' | 'away',
      skills,
      bio,
      socialLinks,
      avatar: avatarData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('teammembers').insertOne(memberData);
    const teamMember = { _id: result.insertedId, ...memberData };
    
    return NextResponse.json({ success: true, data: teamMember }, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
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
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const status = formData.get('status') as string;
    const skills = JSON.parse(formData.get('skills') as string || '[]');
    const bio = formData.get('bio') as string;
    const socialLinks = JSON.parse(formData.get('socialLinks') as string || '{}');
    const avatar = formData.get('avatar') as File;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid team member ID is required' },
        { status: 400 }
      );
    }

    const existingMember = await db.collection('teammembers').findOne({ _id: new ObjectId(id) });
    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    let avatarData = existingMember.avatar;

    // Handle new avatar upload
    if (avatar && avatar.size > 0) {
      // Delete old avatar if it exists
      if (existingMember.avatar?.publicId) {
        await deleteImage(existingMember.avatar.publicId);
      }

      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${avatar.type};base64,${buffer.toString('base64')}`;
      
      const uploadResult = await uploadImage(base64);
      avatarData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const updateData = {
      name,
      email,
      role,
      status: status as 'active' | 'inactive' | 'away',
      skills,
      bio,
      socialLinks,
      avatar: avatarData,
      updatedAt: new Date(),
    };

    await db.collection('teammembers').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const teamMember = await db.collection('teammembers').findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
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
        { success: false, error: 'Valid team member ID is required' },
        { status: 400 }
      );
    }

    const teamMember = await db.collection('teammembers').findOne({ _id: new ObjectId(id) });
    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Delete associated avatar if it exists
    if (teamMember.avatar?.publicId) {
      await deleteImage(teamMember.avatar.publicId);
    }

    const result = await db.collection('teammembers').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Team member deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
