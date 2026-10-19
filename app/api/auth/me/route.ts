import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await dbConnect();
    const member = await db.collection('teammembers').findOne({ _id: new ObjectId(authUser.id) });

    if (!member) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        role: member.role || 'member',
        status: member.status || 'active',
        skills: member.skills || [],
        bio: member.bio || '',
        socialLinks: member.socialLinks || {},
        avatar: member.avatar,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}
