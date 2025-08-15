import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface TeamMember {
  _id: ObjectId | string;
  // Add other team member properties as needed
  [key: string]: any;
}

interface Project {
  _id: ObjectId | string;
  name: string;
  teamMembers?: TeamMember[];
  // Add other project properties as needed
  [key: string]: any;
}

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    // Decode and normalize the name from URL
    const name = decodeURIComponent(params.name).replace(/-/g, ' ').trim();
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    const db = await dbConnect();
    
    // Normalize the name for better matching (handles different unicode representations)
    const normalizedSearchName = name.normalize('NFC');
    
    // Create a regex pattern that matches the name with any whitespace variations
    const regexPattern = normalizedSearchName
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
      .replace(/\s+/g, '\\s+'); // Replace spaces with \s+ to match any whitespace
    
    // Find project by name (case-insensitive and diacritic-insensitive search)
    const project = await db.collection('projects').findOne({
      name: { $regex: new RegExp(`^\\s*${regexPattern}\\s*$`, 'iu') }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create a new object with _id as string for serialization
    const serializedProject = {
      ...project,
      _id: project._id.toString(),
      // Convert any nested ObjectId fields to strings
      teamMembers: project.teamMembers?.map((member: TeamMember) => ({
        ...member,
        _id: member._id.toString()
      }))
    };

    return NextResponse.json({
      success: true,
      data: serializedProject
    });
    
  } catch (error) {
    console.error('Error fetching project by name:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
