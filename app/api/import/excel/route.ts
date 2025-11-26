import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/google-sheets';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST() {
  try {
    // جلب البيانات من Google Sheets
    const rows = await getSheetData('Sheet1!A:E');
    
    if (!rows || rows.length < 2) {
      return NextResponse.json(
        { error: 'لا توجد بيانات في الجدول' },
        { status: 400 }
      );
    }

    // تحويل الصف الأول إلى عناوين الأعمدة
    const headers = rows[0] as string[];
    const data = rows.slice(1).map((row: any[]) => {
      return row.reduce((obj: Record<string, string>, value: string, index: number) => {
        obj[headers[index]] = value;
        return obj;
      }, {} as Record<string, string>);
    });

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'لا توجد بيانات صالحة للاستيراد' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['nationalID', 'name', 'email', 'phone', 'ticketNumber'];
    const firstRow = data[0] as Record<string, unknown>;
    const missingFields = requiredFields.filter(field => !(field in firstRow));

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `يجب أن يحتوي الملف على الأعمدة التالية: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await dbConnect();
    const ticketsCollection = db.collection('tickets');

    // Prepare data for insertion
    const tickets = data.map((ticket: any) => ({
      _id: new ObjectId(),
      nationalID: String(ticket.nationalID),
      name: ticket.name,
      email: ticket.email,
      phone: String(ticket.phone),
      ticketNumber: String(ticket.ticketNumber),
      verified: false,
      verifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert into database
    const result = await ticketsCollection.insertMany(tickets);

    return NextResponse.json({
      success: true,
      importedCount: result.insertedCount,
      message: `تم استيراد ${result.insertedCount} تذكرة بنجاح`
    });

  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الملف' },
      { status: 500 }
    );
  }
}
