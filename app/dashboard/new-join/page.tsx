'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthCheck from '../authCheck';

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  specializedIn: string;
  year: string;
  major: string;
  specialization: string;
  experience: string;
  motivation: string;
  portfolio?: string;
  availability: string;
  agreeTerms: boolean;
  status: string;
  createdAt: string;
}

const Spinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export default function JoinApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const url = searchName
          ? `/api/join?name=${encodeURIComponent(searchName)}`
          : '/api/join';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setApplications(data.data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [searchName]);

  const handleAccept = async (applicationId: string) => {
    try {
      const res = await fetch(`/api/join/accept/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: 'accepted' } : app
          )
        );
        alert('تم قبول الطلب بنجاح!');
      } else {
        alert('فشل في قبول الطلب.');
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      alert('حدث خطأ أثناء قبول الطلب.');
    }
  };

  return (
    <AuthCheck>

    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">طلبات الانضمام</h2>

      <Input
        type="text"
        placeholder="ابحث بالاسم..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="mb-4 max-w-md"
      />

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-2 border">الاسم</TableHead>
                <TableHead className="p-2 border">البريد الإلكتروني</TableHead>
                <TableHead className="p-2 border">الرقم الهاتفي</TableHead>
                <TableHead className="p-2 border">التخصص</TableHead>
                <TableHead className="p-2 border">مميز فى</TableHead>
                <TableHead className="p-2 border">الحالة</TableHead>
                <TableHead className="p-2 border">تاريخ التقديم</TableHead>
                <TableHead className="p-2 border">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id} className="hover:bg-gray-50">
                  <TableCell className="p-2 border">{app.fullName}</TableCell>
                  <TableCell className="p-2 border">{app.email}</TableCell>
                  <TableCell className="p-2 border">{app.phone}</TableCell>
                  <TableCell className="p-2 border">{app.specialization}</TableCell>
                  <TableCell className="p-2 border">{app.specializedIn}</TableCell>
                  <TableCell className="p-2 border">{app.status}</TableCell>
                  <TableCell className="p-2 border">{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="p-2 border">
                    {app.status === 'pending' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAccept(app._id)}
                      >
                        قبول
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
    </AuthCheck>

  );
}
