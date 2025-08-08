import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const db = await dbConnect();
    const events = await db.collection('events').aggregate([
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
      },
      {
        $sort: { date: 1 }
      }
    ]).toArray();
    
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await dbConnect();
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const priority = formData.get('priority') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;
    const attendees = JSON.parse(formData.get('attendees') as string || '[]');
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

    // Convert attendee IDs to ObjectIds
    const attendeeObjectIds = attendees.map((id: string) => new ObjectId(id));

    const eventData = {
      title,
      description,
      date: new Date(date),
      priority: priority as 'low' | 'medium' | 'high' | 'urgent',
      type: type as 'meeting' | 'deadline' | 'workshop' | 'presentation' | 'other',
      location,
      attendees: attendeeObjectIds,
      image: imageData,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('events').insertOne(eventData);
    
    // Get the event with populated attendees for response
    const populatedEvent = await db.collection('events').aggregate([
      {
        $match: { _id: result.insertedId }
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
    ]).toArray();
    
    return NextResponse.json({ success: true, data: populatedEvent[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await dbConnect();
    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const priority = formData.get('priority') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;
    const attendees = JSON.parse(formData.get('attendees') as string || '[]');
    const isCompleted = formData.get('isCompleted') === 'true';
    const image = formData.get('image') as File;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid event ID is required' },
        { status: 400 }
      );
    }

    const existingEvent = await db.collection('events').findOne({ _id: new ObjectId(id) });
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    let imageData = existingEvent.image;

    // Handle new image upload
    if (image && image.size > 0) {
      // Delete old image if it exists
      if (existingEvent.image?.publicId) {
        await deleteImage(existingEvent.image.publicId);
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

    // Convert attendee IDs to ObjectIds
    const attendeeObjectIds = attendees.map((id: string) => new ObjectId(id));

    const updateData = {
      title,
      description,
      date: new Date(date),
      priority: priority as 'low' | 'medium' | 'high' | 'urgent',
      type: type as 'meeting' | 'deadline' | 'workshop' | 'presentation' | 'other',
      location,
      attendees: attendeeObjectIds,
      image: imageData,
      isCompleted,
      updatedAt: new Date(),
    };

    await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Get the updated event with populated attendees
    const event = await db.collection('events').aggregate([
      {
        $match: { _id: new ObjectId(id) }
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
    ]).toArray();
    
    return NextResponse.json({ success: true, data: event[0] });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
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
        { success: false, error: 'Valid event ID is required' },
        { status: 400 }
      );
    }

    const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete associated image if it exists
    if (event.image?.publicId) {
      await deleteImage(event.image.publicId);
    }

    const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
