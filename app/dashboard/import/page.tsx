'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, FileCheck } from 'lucide-react';

export default function ImportData() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/import/excel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: `تم استيراد ${data.importedCount} سجل بنجاح` });
        setFile(null);
        // Clear file input
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(data.error || 'حدث خطأ أثناء استيراد البيانات');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'حدث خطأ غير متوقع' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              استيراد بيانات التذاكر من ملف إكسل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label 
                  htmlFor="file" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  اختر ملف إكسل
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="file"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    disabled={isLoading}
                  />
                  {file && (
                    <div className="flex items-center text-green-600">
                      <FileCheck className="w-5 h-5 mr-1" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  يجب أن يكون الملف بتنسيق XLSX أو XLS أو CSV. تأكد من أن الأعمدة متطابقة مع النموذج المطلوب.
                </p>
              </div>

              {message && (
                <div className={`p-4 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  رجوع
                </Button>
                <Button 
                  type="submit" 
                  disabled={!file || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الاستيراد...
                    </>
                  ) : (
                    <>
                      <Upload className="ml-2 h-4 w-4" />
                      استيراد البيانات
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm text-yellow-700">
                <strong>ملاحظة هامة:</strong> يجب أن يحتوي ملف الإكسل على الأعمدة التالية:
                <ul className="list-disc mr-5 mt-2 space-y-1">
                  <li>nationalID (الرقم القومي)</li>
                  <li>name (الاسم بالكامل)</li>
                  <li>email (البريد الإلكتروني)</li>
                  <li>phone (رقم الهاتف)</li>
                  <li>ticketNumber (رقم التذكرة)</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
