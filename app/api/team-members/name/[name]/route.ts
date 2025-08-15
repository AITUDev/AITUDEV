import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const db = await dbConnect();
    
    // Convert URL-encoded name back to normal and replace hyphens with spaces
    const name = decodeURIComponent(params.name).replace(/-/g, ' ');
    
    // Find team member by name (case-insensitive, exact match)
    const teamMember = await db.collection('teammembers').findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    
    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    console.error('Error fetching team member by name:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}
