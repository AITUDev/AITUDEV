import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    const db = await dbConnect();
    
    if (name) {
      // Search for team members by name (case-insensitive, partial match)
      const teamMembers = await db.collection('teammembers')
        .find({ 
          name: { $regex: name, $options: 'i' } 
        })
        .sort({ name: 1 })
        .toArray();
      
      return NextResponse.json({ success: true, data: teamMembers });
    }
    
    // If no name parameter, return all team members
    const teamMembers = await db.collection('teammembers')
      .find({})
      .sort({ name: 1 })
      .toArray();
      
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
    const email = (formData.get('email') as string || '').toLowerCase().trim();
    const role = formData.get('role') as string;
    const accountRole = (formData.get('accountRole') as string) || 'member';
    const password = formData.get('password') as string;
    const status = formData.get('status') as string;
    const skills = JSON.parse(formData.get('skills') as string || '[]');
    const bio = formData.get('bio') as string;
    const socialLinks = JSON.parse(formData.get('socialLinks') as string || '{}');
    const avatar = formData.get('avatar') as File;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    let avatarData = undefined;
    if (avatar && typeof avatar !== 'string' && avatar.size > 0) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${avatar.type};base64,${buffer.toString('base64')}`;
      
      const uploadResult = await uploadImage(base64);
      avatarData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    let passwordHash = undefined;
    if (password && password.trim().length >= 4) {
      const { hashPassword } = await import('@/lib/auth');
      passwordHash = await hashPassword(password.trim());
    } else {
      // Default password if creating account
      const { hashPassword } = await import('@/lib/auth');
      passwordHash = await hashPassword('aitu123456');
    }

    const memberData = {
      name,
      email,
      role,
      accountRole: accountRole as 'admin' | 'lead' | 'member',
      passwordHash,
      status: (status as 'active' | 'inactive' | 'away') || 'active',
      skills,
      bio,
      socialLinks,
      avatar: avatarData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('teammembers').insertOne(memberData);
    const { passwordHash: _, ...safeMember } = memberData;
    const teamMember = { _id: result.insertedId, ...safeMember };
    
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
    const email = (formData.get('email') as string || '').toLowerCase().trim();
    const role = formData.get('role') as string;
    const accountRole = formData.get('accountRole') as string;
    const password = formData.get('password') as string;
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

    if (avatar && typeof avatar !== 'string' && avatar.size > 0) {
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

    let passwordHash = existingMember.passwordHash;
    if (password && password.trim().length >= 4) {
      const { hashPassword } = await import('@/lib/auth');
      passwordHash = await hashPassword(password.trim());
    }

    const updateData: any = {
      name: name || existingMember.name,
      email: email || existingMember.email,
      role: role || existingMember.role,
      status: (status as 'active' | 'inactive' | 'away') || existingMember.status || 'active',
      skills: skills.length > 0 ? skills : existingMember.skills,
      bio: bio !== undefined ? bio : existingMember.bio,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : existingMember.socialLinks,
      avatar: avatarData,
      updatedAt: new Date(),
    };

    if (accountRole) {
      updateData.accountRole = accountRole;
    }
    if (passwordHash) {
      updateData.passwordHash = passwordHash;
    }

    await db.collection('teammembers').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedMember = await db.collection('teammembers').findOne({ _id: new ObjectId(id) });
    if (updatedMember) {
      delete updatedMember.passwordHash;
    }
    return NextResponse.json({ success: true, data: updatedMember });
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
