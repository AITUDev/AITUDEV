import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

// GET all join requests (for admin purposes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    const db = await dbConnect();
    
    if (name) {
      // Search for team members by name (case-insensitive, partial match)
      const applications = await db.collection('join')
        .find({ 
          name: { $regex: name, $options: 'i' } 
        })
        .sort({ name: 1 })
        .toArray();
      
      return NextResponse.json({ success: true, data: applications });
    }
    
    // If no name parameter, return all team members
    const applications = await db.collection('join')
      .find({})
      .sort({ createdAt: 1 })
      .toArray();
      
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching join applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch join applications' },
      { status: 500 }
    );
  }
}

// POST a new join application
export async function POST(request: NextRequest) {
  try {
    const db = await dbConnect();
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      specializedIn,
      year,
      major,
      specialization,
      experience,
      motivation,
      portfolio,
      availability,
      agreeTerms
    } = body;

    // Basic validation
    if (!fullName || !email || !phone || !specializedIn || !year || !major || !specialization || !experience || !motivation || !agreeTerms) {
      return NextResponse.json(
        { success: false, error: 'all fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingApplication = await db.collection('join').findOne({ email });
    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'email already exists' },
        { status: 400 }
      );
    }

    const applicationData = {
      fullName,
      email,
      phone,
      specializedIn,
      year,
      major,
      specialization,
      experience,
      motivation,
      portfolio: portfolio || '', // Optional field
      availability,
      agreeTerms,
      status: 'pending', // Default status for new applications
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('join').insertOne(applicationData);
    const newApplication = { _id: result.insertedId, ...applicationData };
    
    return NextResponse.json({ success: true, data: newApplication }, { status: 201 });
  } catch (error) {
    console.error('Error creating join application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create join application' },
      { status: 500 }
    );
  }
}
