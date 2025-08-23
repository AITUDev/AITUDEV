import { ReactNode } from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react
  details: {
    overview: string;
    features: string[];
    process: string[];
    faqs: { question: string; answer: string }[];
  };
}

export const services: Service[] = [
  {
    id: 'web-development',
    title: 'تطوير المواقع',
    description: 'تصميم وتطوير مواقع احترافية متوافقة مع جميع الأجهزة',
    icon: 'Globe',
    details: {
      overview: 'نقدم حلول تطوير ويب مخصصة تلبي احتياجات عملك مع أحدث التقنيات وأفضل الممارسات.',
      features: [
        'تصميم متجاوب يعمل على جميع الأجهزة',
        'واجهة مستخدم سهلة وجذابة',
        'تحسين محركات البحث (SEO)',
        'تكامل مع أنظمة الدفع الإلكتروني',
        'حماية وأمان عالي المستوى'
      ],
      process: [
        'تحليل المتطلبات والاحتياجات',
        'تصميم واجهات المستخدم',
        'تطوير الوظائف الأساسية',
        'اختبار الجودة والتوافق',
        'التدريب والتسليم'
      ],
      faqs: [
        {
          question: 'ما هي مدة تطوير الموقع؟',
          answer: 'تختلف المدة حسب تعقيد المشروع، ولكن في المتوسط تستغرق المواقع من 4 إلى 12 أسبوعًا.'
        },
        {
          question: 'هل تدعمون الاستضافة والنطاق؟',
          answer: 'نعم، نقدم حزمًا شاملة تتضمن الاستضافة والنطاق والصيانة.'
        }
      ]
    }
  },
  // ... other services with similar structure
];
