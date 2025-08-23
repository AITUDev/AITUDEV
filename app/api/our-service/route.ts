import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await dbConnect();
    const primary = await db.collection('our-service').find({}).toArray();
    let legacy: any[] = [];
    try {
      legacy = await db.collection('services').find({}).toArray();
    } catch {}

    // Merge and dedupe by _id
    const map = new Map<string, any>();
    for (const doc of [...legacy, ...primary]) {
      map.set(String(doc._id), doc);
    }
    const merged = Array.from(map.values());
    return NextResponse.json({ success: true, data: merged });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, icon, type, price_per_hour, price_per_project } = await request.json();
    const db = await dbConnect();
    
    // Basic validation
    if (!title || !description || !icon || !type || !price_per_hour || !price_per_project) {
      return NextResponse.json(
        { success: false, error: 'Title, description, icon, type, price_per_hour and price_per_project are required' },
        { status: 400 }
      );
    }

    const doc = {
      title,
      description,
      icon,
      type,
      price_per_hour,
      price_per_project,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('our-service').insertOne(doc);
    const inserted = { _id: result.insertedId, ...doc };

    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
