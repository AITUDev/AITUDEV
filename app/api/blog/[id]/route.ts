import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid blog post ID' }, { status: 400 });
    }

    const db = await connectToDB();
    const blogCollection = db.collection('blog_posts');
    
    const post = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}