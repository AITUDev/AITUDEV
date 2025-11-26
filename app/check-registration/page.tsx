'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, QrCode, AlertCircle, Camera } from 'lucide-react';

// تعريف window.jsQR للـ TypeScript
declare global {
  interface Window {
    jsQR: any;
  }
}


export default function VerifyTicket() {
  const [result, setResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    name?: string;
    email?: string;
  }>({ status: 'idle', message: '' });

  const [manualID, setManualID] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedOnce, setScannedOnce] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isCheckingCamera, setIsCheckingCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // التحقق من صلاحيات الكاميرا عند فتح الماسح
  useEffect(() => {
    if (!showScanner) {
      // إيقاف الكاميرا عند الإغلاق
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }

    setCameraError(null);
    setScannedOnce(false);
    setIsCheckingCamera(true);

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError('المتصفح الحالي لا يدعم الوصول إلى الكاميرا.');
          setShowScanner(false);
          setIsCheckingCamera(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
            setCameraError('تعذر تشغيل الفيديو');
          });
        }

        setPermissionDenied(false);
        setIsCheckingCamera(false);

        // بدء مسح QR
        scanQRCode();
      } catch (error: any) {
        console.error('Camera access error:', error.name, error.message);
        let errorMsg = 'تعذر الوصول إلى الكاميرا. يرجى التأكد من منح الإذن اللازم.';

        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setPermissionDenied(true);
          errorMsg = 'تم رفض إذن الكاميرا.\n\nالحل:\n1️⃣ اضغط على رمز القفل 🔒 في شريط العناوين\n2️⃣ ابحث عن "Camera"\n3️⃣ اختر "السماح" (Allow)';
        } else if (error.name === 'NotFoundError') {
          errorMsg = 'لم يتم العثور على كاميرا على الجهاز.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMsg = 'الكاميرا قيد الاستخدام من قبل تطبيق آخر.\nأغلق التطبيقات الأخرى وحاول مرة أخرى.';
        } else if (error.name === 'SecurityError') {
          errorMsg = 'لا يمكن الوصول للكاميرا.\nتأكد من استخدام HTTPS.';
        } else if (error.name === 'AbortError') {
          errorMsg = 'تم إيقاف محاولة الوصول للكاميرا.\nاضغط إعادة محاولة.';
        }

        setCameraError(errorMsg);
        setShowScanner(false);
        setIsCheckingCamera(false);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [showScanner]);

  // دالة مسح QR استخدام jsQR مباشرة
  const scanQRCode = () => {
    if (!showScanner || scannedOnce) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isScanning = true;

    const scan = () => {
      if (!isScanning || scannedOnce) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // استخدام مكتبة jsQR بسيطة مدمجة
        // نحاول فك تشفير البيانات باستخدام pattern matching بسيط
        try {
          // نبحث عن النمط في الكود
          const pixels = imageData.data;
          let blackPixelCount = 0;
          const threshold = 128;

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const brightness = (r + g + b) / 3;

            if (brightness < threshold) {
              blackPixelCount++;
            }
          }

          // إذا وجدنا نسبة عالية من البيكسلات السوداء، قد يكون هناك QR
          // هذا مجرد كشف أساسي - في الواقع نحتاج jsQR
          if (blackPixelCount > pixels.length / 8) {
            // جرب استخراج النص باستخدام OCR أو مكتبة QR
            loadAndScanQR(imageData);
          }
        } catch (error) {
          console.error('QR detection error:', error);
        }
      }

      if (showScanner && !scannedOnce) {
        requestAnimationFrame(scan);
      } else {
        isScanning = false;
      }
    };

    scan();
  };

  // تحميل مكتبة jsQR ديناميكياً وفحص QR
  const loadAndScanQR = async (imageData: ImageData) => {
    try {
      // تحميل مكتبة jsQR من CDN
      if (!window.jsQR) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
        script.async = true;
        script.onload = () => {
          if (window.jsQR) {
            performQRScan(imageData);
          }
        };
        document.head.appendChild(script);
      } else {
        performQRScan(imageData);
      }
    } catch (error) {
      console.error('Error loading jsQR:', error);
    }
  };

  const performQRScan = (imageData: ImageData) => {
    if (!window.jsQR) return;

    try {
      const code = window.jsQR(
        imageData.data,
        imageData.width,
        imageData.height,
        { inversionAttempts: 'dontInvert' }
      );

      if (code && code.data && !scannedOnce) {
        setScannedOnce(true);
        handleScan(code.data);
      }
    } catch (error) {
      console.error('QR scan error:', error);
    }
  };

  const handleScan = async (nationalID: string) => {
    if (!nationalID || result.status === 'loading') return;

    setResult({ status: 'loading', message: 'جاري التحقق...' });

    try {
      const response = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nationalID: nationalID.trim() }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || data.message || 'حدث خطأ في التحقق');
      }

      if (data.registered) {
        setResult({
          status: 'success',
          message: data.message || 'تم التحقق من صحة التذكرة بنجاح',
          name: data.name,
          email: data.email,
        });
        
        // إغلاق الماسح الضوئي بعد نجاح المسح
        if (showScanner) {
          setShowScanner(false);
        }
      } else {
        throw new Error(data.message || 'لم يتم العثور على التذكرة');
      }
    } catch (error) {
      setResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
      });
    }
  };

  const handleQrScan = (result: any) => {
    // تجنب المسح المتعدد
    if (scannedOnce || !result) return;

    try {
      const qrValue = result?.text || result?.data;

      if (qrValue && qrValue.trim()) {
        setScannedOnce(true);
        handleScan(qrValue);
      }
    } catch (error: any) {
      console.error('QR scanning error:', error.message);
    }
  };

  // Reset errors when user attempts to close scanner
  const handleCloseScanner = () => {
    setShowScanner(false);
    setScannedOnce(false);
    setCameraError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
            التحقق من التذاكر
          </h1>
          <p className="text-sm sm:text-lg text-gray-600">
            قم بمسح باركود التذكرة أو أدخل الرقم القومي يدوياً للتحقق من التسجيل
          </p>
        </div>

        <div className="space-y-8 lg:space-y-0 lg:grid lg:gap-8 lg:grid-cols-2">
          {/* QR Scanner Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <QrCode className="w-6 h-6" />
                مسح الباركود
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {showScanner ? (
                <div className="space-y-4">
                  {cameraError ? (
                    <div className="border-2 border-red-300 rounded-lg p-4 sm:p-6 bg-red-50 flex flex-col items-center justify-center min-h-80">
                      <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                      <p className="text-red-700 text-center font-medium mb-4 text-sm sm:text-base whitespace-pre-line">{cameraError}</p>
                      <div className="flex flex-col gap-2 w-full">
                        {permissionDenied && (
                          <>
                            <Button
                              onClick={() => {
                                setPermissionDenied(false);
                                setCameraError(null);
                                // Retry camera access immediately
                                setShowScanner(false);
                                setTimeout(() => setShowScanner(true), 100);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                            >
                              🔄 إعادة محاولة
                            </Button>
                            <p className="text-xs text-center text-red-600 py-2">💡 تلميحة: تأكد من السماح للموقع بالوصول للكاميرا</p>
                          </>
                        )}
                        <Button
                          onClick={() => {
                            setCameraError(null);
                            setShowScanner(false);
                            setPermissionDenied(false);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          إغلاق
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border-2 border-blue-300 w-full">
                      <div className="relative w-full bg-black" style={{ aspectRatio: '1/1', maxHeight: 'min(100vw, 500px)' }}>
                        {/* Video Element */}
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ display: 'block' }}
                        />

                        {/* Canvas for QR processing (hidden) */}
                        <canvas
                          ref={canvasRef}
                          style={{ display: 'none' }}
                        />

                        {/* QR Scan Frame */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="border-2 border-blue-500 rounded-lg aspect-square max-w-80 relative bg-blue-500/5" style={{ width: 'min(70%, 300px)', height: 'min(70%, 300px)' }}>
                            <div className="absolute -top-1 -left-1 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                            <div className="absolute -bottom-1 -left-1 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                          </div>
                        </div>

                        {/* Loading or Instruction */}
                        {result.status === 'loading' && (
                          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-3" />
                              <p className="text-white font-medium">{result.message}</p>
                            </div>
                          </div>
                        )}

                        {/* Help Text */}
                        <div className="absolute bottom-0 left-0 right-0 text-center text-white text-xs sm:text-sm bg-black bg-opacity-60 py-2 sm:py-3">
                          <p className="font-medium">قم بتوجيه الكاميرا نحو رمز QR</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleCloseScanner}
                    className="w-full"
                  >
                    إغلاق الكاميرا
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 space-y-4">
                  <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4" />
                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">قم بفتح الكاميرا لمسح رمز QR على التذكرة</p>
                    <p className="text-xs sm:text-sm text-gray-500">⚠️ سيطلب منك المتصفح السماح بالوصول للكاميرا - اضغط "السماح" (Allow)</p>
                  </div>
                  <Button
                    onClick={() => {
                      setPermissionDenied(false);
                      setCameraError(null);
                      setShowScanner(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-6 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto"
                  >
                    فتح كاميرا المسح
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Entry Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl">
                إدخال يدوي
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="nationalID" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    الرقم القومي
                  </label>
                  <Input
                    id="nationalID"
                    type="text"
                    placeholder="أدخل الرقم القومي الموجود في التذكرة"
                    value={manualID}
                    onChange={(e) => setManualID(e.target.value)}
                    className="text-right text-base sm:text-lg py-2 sm:py-3 px-3 sm:px-4"
                  />
                </div>

                <Button
                  onClick={() => handleScan(manualID)}
                  disabled={!manualID.trim() || result.status === 'loading'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 text-sm sm:text-lg"
                >
                  {result.status === 'loading' ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    'تحقق من التذكرة'
                  )}
                </Button>

                {/* Result Display */}
                {(result.status === 'success' || result.status === 'error') && (
                  <div className={`mt-6 p-3 sm:p-4 rounded-lg ${
                    result.status === 'success' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 ${result.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {result.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm sm:text-lg font-medium ${
                          result.status === 'success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.message}
                        </h3>
                        {result.status === 'success' && (
                          <div className="mt-2 text-right space-y-1">
                            <p className="text-green-700 text-xs sm:text-sm">
                              <span className="font-semibold">الاسم:</span> {result.name}
                            </p>
                            <p className="text-green-700 text-xs sm:text-sm break-all">
                              <span className="font-semibold">البريد الإلكتروني:</span> {result.email}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Text */}
        <div className="mt-8 sm:mt-12 space-y-6">
          {/* Troubleshooting Section */}
          <Card className="bg-blue-50 border border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-900">🔧 حل المشاكل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-blue-900">
              <div>
                <h4 className="font-semibold mb-1">❌ إذا حصلت على خطأ "رفض إذن الكاميرا":</h4>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>ابحث عن رمز القفل 🔒 في شريط العناوين</li>
                  <li>اضغط عليه لتظهر الأذونات</li>
                  <li>ابحث عن "Camera" وغيّر الإذن إلى "السماح"</li>
                  <li>أعد تحميل الصفحة</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-1">⚠️ متطلبات الحد الأدنى:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>اتصال آمن (HTTPS)</li>
                  <li>متصفح حديث يدعم الكاميرا</li>
                  <li>كاميرا عاملة على الجهاز</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="text-center text-xs sm:text-sm text-gray-500 px-2">
            <p>في حالة استمرار المشكلة، يرجى التوجه إلى مكتب التسجيل</p>
            <p className="mt-1 text-xs sm:text-sm">هاتف: 123-456-789 | البريد الإلكتروني: support@aitu.dev</p>
          </div>
        </div>
      </div>
    </div>
  );
}