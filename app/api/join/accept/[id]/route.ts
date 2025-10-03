import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    const objectId = new ObjectId(id);

    const result = await db.collection('join').updateOne(
      { _id: objectId },
      { $set: { status: 'accepted', updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Application accepted successfully' });
  } catch (error) {
    console.error('Error accepting application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to accept application' },
      { status: 500 }
    );
  }
}
