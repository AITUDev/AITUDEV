import { NextResponse } from 'next/server';

// Google Sheets ID من الرابط المعطى
const SPREADSHEET_ID = '1kJ8wK5jauvIHCyAW_TtWWY-vvhXhfXtaSQxYewLJPOU';

// دالة للحصول على البيانات من Google Sheets باستخدام طريقة export
async function getSheetData() {
  try {
    // طريقة 1: استخدام export CSV من Google Sheets
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;
    
    const response = await fetch(csvUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch CSV from Google Sheets:', response.status);
      return getLocalData();
    }
    
    const csvText = await response.text();
    
    // تحويل CSV إلى مصفوفة
    const lines = csvText.split('\n').filter(line => line.trim());
    const rows = lines.map(line => {
      // معالجة CSV بسيطة
      return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
    });
    
    console.log('Successfully fetched from Google Sheets CSV export');
    return rows;
  } catch (error) {
    console.error('Error fetching from Google Sheets CSV:', error);
    
    // طريقة 2: جرب Google Sheets API
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A:E`;
      const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
      const fullUrl = apiKey ? `${url}?key=${apiKey}` : url;
      
      const apiResponse = await fetch(fullUrl);
      
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        console.log('Successfully fetched from Google Sheets API');
        return data.values || [];
      }
    } catch (apiError) {
      console.error('Error fetching from Google Sheets API:', apiError);
    }
    
    // استخدام البيانات المحلية كـ fallback
    console.log('Using local fallback data');
    return getLocalData();
  }
}

// بيانات محلية كـ fallback
function getLocalData() {
  return [
    ['full Name', 'Email', 'colStatus', 'National ID', 'ticketNumber'],
    ['Zeyad Mohamed Rabea Mohamed', 'zeyad33zer@gmail.com', 'تم الإرسال', '30707142500192', '1'],
    ['Sherif Mansour Omran', 'sherifomran02@gmail.com', 'تم الإرسال', '30502272500452', '2'],
    ['Ahmed Magdy', 'ahmedomarmagdy0@gmail.com', 'تم الإرسال', '30503102104656', '3'],
    ['آلاء يسر احمد عراج', 'aalaasaad747@gmail.com', 'تم الإرسال', '30611262501101', '4'],
    ['Mahmoud Osman', 'eng.osman13@gmail.com', 'تم الإرسال', '30603102400837', '5'],
    ['Mazen Gaafer Mahmoud', 'mazengaafer8@gmail.com', 'تم الإرسال', '30705063200091', '6'],
  ];
}

export async function GET() {
  try {
    const rows = await getSheetData();
    
    if (rows.length < 2) {
      return NextResponse.json(
        { 
          error: 'خطأ في تحميل البيانات',
          tickets: []
        },
        { status: 500 }
      );
    }

    // تحويل الصفوف إلى كائنات
    const tickets = rows.slice(1).map(row => ({
      name: row[0] || 'غير محدد',
      email: row[1] || 'غير محدد',
      status: row[2] || 'غير محدد',
      nationalID: row[3] || 'غير محدد',
      ticketNumber: row[4] || 'غير محدد'
    }));

    return NextResponse.json({
      tickets,
      count: tickets.length,
      lastUpdated: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { 
        error: 'حدث خطأ أثناء جلب البيانات',
        tickets: []
      },
      { status: 500 }
    );
  }
}
