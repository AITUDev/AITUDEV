import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, comparePassword, hashPassword } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    const member = await db.collection('teammembers').findOne({ _id: new ObjectId(authUser.id) });

    if (!member) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (member.passwordHash) {
      const isValid = await comparePassword(currentPassword, member.passwordHash);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
      }
    }

    const newHash = await hashPassword(newPassword);
    await db.collection('teammembers').updateOne(
      { _id: member._id },
      { $set: { passwordHash: newHash, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update password' }, { status: 500 });
  }
}
