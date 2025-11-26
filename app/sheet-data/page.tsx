'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, RefreshCw, Download } from 'lucide-react';

interface TicketData {
  name: string;
  email: string;
  status: string;
  nationalID: string;
  ticketNumber: string;
}

export default function SheetData() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchID, setSearchID] = useState('');
  const [result, setResult] = useState<TicketData | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sheet-data');
      const data = await response.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchID.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalID: searchID })
      });

      const data = await response.json();
      if (data.registered) {
        setResult({
          name: data.name,
          email: data.email,
          nationalID: searchID,
          status: 'تم التحقق',
          ticketNumber: data.ticketNumber
        });
      } else {
        setResult(null);
        alert('لم يتم العثور على بيانات لهذا الرقم القومي');
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const downloadCSV = () => {
    const headers = ['الاسم', 'البريد الإلكتروني', 'الحالة', 'الرقم القومي', 'رقم التذكرة'];
    const csvContent = [
      headers.join(','),
      ...tickets.map(t => [t.name, t.email, t.status, t.nationalID, t.ticketNumber].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `tickets_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            بيانات التذاكر - Tickets Data
          </h1>
          <p className="text-lg text-gray-600">
            عرض وإدارة بيانات التذاكر من Google Sheets
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
            <CardTitle>البحث عن تذكرة</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="أدخل الرقم القومي..."
                value={searchID}
                onChange={(e) => setSearchID(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                بحث
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">نتائج البحث:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">الاسم</p>
                    <p className="font-semibold">{result.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                    <p className="font-semibold text-blue-600">{result.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الرقم القومي</p>
                    <p className="font-semibold">{result.nationalID}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">رقم التذكرة</p>
                    <p className="font-semibold">{result.ticketNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-2">إجمالي التذاكر</p>
              <p className="text-4xl font-bold text-blue-600">{tickets.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-2">تم التحقق</p>
              <p className="text-4xl font-bold text-green-600">
                {tickets.filter(t => t.status === 'تم الإرسال').length}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <Button
                onClick={downloadCSV}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                تحميل البيانات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle>قائمة التذاكر</CardTitle>
              <Button
                onClick={fetchAllData}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-green-700"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading && tickets.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-right font-semibold">الاسم</th>
                      <th className="px-4 py-3 text-right font-semibold">البريد الإلكتروني</th>
                      <th className="px-4 py-3 text-right font-semibold">الحالة</th>
                      <th className="px-4 py-3 text-right font-semibold">الرقم القومي</th>
                      <th className="px-4 py-3 text-right font-semibold">التذكرة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-blue-50`}
                      >
                        <td className="px-4 py-3">{ticket.name}</td>
                        <td className="px-4 py-3 text-blue-600">{ticket.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">{ticket.nationalID}</td>
                        <td className="px-4 py-3 font-semibold">{ticket.ticketNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
