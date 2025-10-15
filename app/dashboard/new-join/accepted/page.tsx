'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AuthCheck from '../../authCheck';
import Link from 'next/link';

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
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
    </div>
);

export default function AcceptedApplications() {
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
                    const acceptedOnly = data.data.filter(
                        (app: Application) => app.status === 'accepted'
                    );
                    setApplications(acceptedOnly);
                }
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [searchName]);

    return (
        <AuthCheck>
            <Card className="p-6 shadow-lg border rounded-2xl bg-white">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        ✅ الطلبات المقبولة
                    </CardTitle>
                    <div className="mt-4 md:mt-0 w-full md:w-1/3">
                        <Input
                            placeholder="🔍 ابحث بالاسم..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="rounded-xl"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <Spinner />
                    ) : applications.length === 0 ? (
                        <p className="text-center text-gray-500 py-6">
                            لا توجد طلبات مقبولة حتى الآن.
                        </p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                            {applications.map((app) => (
                                <Card
                                    key={app._id}
                                    className="p-4 rounded-2xl shadow-md border hover:shadow-lg transition-all duration-200"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {app.fullName}
                                    </h3>

                                    <div className="text-sm space-y-1 text-gray-600">
                                        <p>
                                            <strong>📧 البريد:</strong> {app.email}
                                        </p>
                                        <p>
                                            <strong>📞 الهاتف:</strong> {app.phone}
                                        </p>
                                        <p>
                                            <strong>🎓 السنة:</strong> {app.year}
                                        </p>
                                        <p>
                                            <strong>🏫 التخصص:</strong> {app.specialization}
                                        </p>
                                        <p>
                                            <strong>🔹 القسم:</strong> {app.major}
                                        </p>
                                        <p>
                                            <strong>💡 مميز في:</strong> {app.specializedIn}
                                        </p>
                                        <p>
                                            <strong>🧠 الخبرة:</strong> {app.experience}
                                        </p>
                                        <p>
                                            <strong>🔥 الدافع:</strong> {app.motivation}
                                        </p>
                                        <p>
                                            <strong>🕒 متاح في:</strong> {app.availability}
                                        </p>

                                        {app.portfolio && (
                                            <p>
                                                <strong>🌐 البورتفوليو:</strong>{' '}
                                                <Link
                                                    href={app.portfolio}
                                                    target="_blank"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    زيارة الرابط
                                                </Link>
                                            </p>
                                        )}

                                        <p>
                                            <strong>📅 تاريخ القبول:</strong>{' '}
                                            {new Date(app.createdAt).toLocaleDateString('ar-EG')}
                                        </p>

                                        <div className="pt-2">
                                            <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                                مقبول ✅
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthCheck>
    );
}
