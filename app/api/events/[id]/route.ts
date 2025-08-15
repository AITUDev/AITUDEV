import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    const event = await db.collection('events').aggregate([
      {
        $match: { _id: new ObjectId(params.id) }
      },
      {
        $lookup: {
          from: 'teammembers',
          localField: 'attendees',
          foreignField: '_id',
          as: 'attendees',
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                avatar: 1
              }
            }
          ]
        }
      }
    ]).next();

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
