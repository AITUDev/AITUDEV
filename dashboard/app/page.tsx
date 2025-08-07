"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, Users, Calendar, BookOpen, BarChart3, Settings } from 'lucide-react'

export default function HomePage() {
  const sections = [
    {
      title: 'المشاريع',
      description: 'إدارة وتتبع جميع المشاريع',
      icon: FolderOpen,
      href: '/projects',
      color: 'bg-blue-500'
    },
    {
      title: 'فريق القيادة',
      description: 'إدارة أعضاء فريق القيادة',
      icon: Users,
      href: '/team',
      color: 'bg-green-500'
    },
    {
      title: 'الفعاليات وورش العمل',
      description: 'إدارة جميع الفعاليات والأنشطة',
      icon: Calendar,
      href: '/events',
      color: 'bg-purple-500'
    },
    {
      title: 'المدونة',
      description: 'إدارة مقالات ومحتوى المدونة',
      icon: BookOpen,
      href: '/blog',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">لوحة تحكم موقع Aitu للتطوير</h1>
        <p className="text-xl text-gray-600">إدارة شاملة لجميع أقسام الموقع</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${section.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  إدارة {section.title}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">مرحباً بك في نظام الإدارة</CardTitle>
            <CardDescription className="text-lg">
              يمكنك الآن إدارة جميع أقسام موقع Aitu للتطوير من مكان واحد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">مشاريع نشطة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">أعضاء الفريق</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">15</div>
                <div className="text-sm text-gray-600">فعاليات قادمة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">24</div>
                <div className="text-sm text-gray-600">مقالات منشورة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
