"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Calendar, MapPin, Users, Clock } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  type: 'workshop' | 'seminar' | 'conference' | 'meetup'
  date: string
  time: string
  location: string
  capacity: number
  registered: number
  price: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  image: string
  organizer: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'ورشة تطوير تطبيقات React',
      description: 'ورشة عمل شاملة لتعلم أساسيات وتقنيات متقدمة في تطوير تطبيقات React مع أمثلة عملية ومشاريع تطبيقية.',
      type: 'workshop',
      date: '2024-02-15',
      time: '10:00',
      location: 'مركز التدريب التقني - الرياض',
      capacity: 30,
      registered: 25,
      price: 500,
      status: 'upcoming',
      image: '/react-workshop.png',
      organizer: 'أحمد محمد'
    },
    {
      id: '2',
      title: 'مؤتمر الذكاء الاصطناعي 2024',
      description: 'مؤتمر سنوي يجمع خبراء الذكاء الاصطناعي لمناقشة أحدث التطورات والتقنيات في هذا المجال.',
      type: 'conference',
      date: '2024-03-20',
      time: '09:00',
      location: 'فندق الريتز كارلتون - جدة',
      capacity: 200,
      registered: 150,
      price: 1200,
      status: 'upcoming',
      image: '/ai-conference.png',
      organizer: 'فاطمة علي'
    },
    {
      id: '3',
      title: 'لقاء مطورين الويب',
      description: 'لقاء شهري لمطورين الويب لتبادل الخبرات ومناقشة أحدث التقنيات والأدوات في تطوير الويب.',
      type: 'meetup',
      date: '2024-01-25',
      time: '18:00',
      location: 'مقهى التقنية - الدمام',
      capacity: 50,
      registered: 45,
      price: 0,
      status: 'completed',
      image: '/web-developers-meetup.png',
      organizer: 'محمد حسن'
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'workshop' as Event['type'],
    date: '',
    time: '',
    location: '',
    capacity: 0,
    price: 0,
    status: 'upcoming' as Event['status'],
    organizer: ''
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'workshop',
      date: '',
      time: '',
      location: '',
      capacity: 0,
      price: 0,
      status: 'upcoming',
      organizer: ''
    })
  }

  const handleAdd = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...formData,
      registered: 0,
      image: `/placeholder.svg?height=200&width=300&query=${formData.title}`
    }
    setEvents([...events, newEvent])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      type: event.type,
      date: event.date,
      time: event.time,
      location: event.location,
      capacity: event.capacity,
      price: event.price,
      status: event.status,
      organizer: event.organizer
    })
  }

  const handleUpdate = () => {
    if (!editingEvent) return
    
    const updatedEvent: Event = {
      ...editingEvent,
      ...formData
    }
    
    setEvents(events.map(e => e.id === editingEvent.id ? updatedEvent : e))
    setEditingEvent(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800'
      case 'seminar': return 'bg-green-100 text-green-800'
      case 'conference': return 'bg-purple-100 text-purple-800'
      case 'meetup': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: Event['type']) => {
    switch (type) {
      case 'workshop': return 'ورشة عمل'
      case 'seminar': return 'ندوة'
      case 'conference': return 'مؤتمر'
      case 'meetup': return 'لقاء'
      default: return type
    }
  }

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'قادم'
      case 'ongoing': return 'جاري'
      case 'completed': return 'مكتمل'
      case 'cancelled': return 'ملغي'
      default: return status
    }
  }

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">الفعاليات وورش العمل</h1>
          <p className="text-gray-600">إدارة جميع الفعاليات والأنشطة</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة فعالية جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة فعالية جديدة</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان الفعالية</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="أدخل عنوان الفعالية"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف الفعالية"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">نوع الفعالية</Label>
                  <Select value={formData.type} onValueChange={(value: Event['type']) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">ورشة عمل</SelectItem>
                      <SelectItem value="seminar">ندوة</SelectItem>
                      <SelectItem value="conference">مؤتمر</SelectItem>
                      <SelectItem value="meetup">لقاء</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value: Event['status']) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">قادم</SelectItem>
                      <SelectItem value="ongoing">جاري</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">التاريخ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">الوقت</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">المكان</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="مكان إقامة الفعالية"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="capacity">السعة</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">السعر (ريال)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organizer">المنظم</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="اسم منظم الفعالية"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAdd}>إضافة الفعالية</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getTypeColor(event.type)}>
                  {getTypeText(event.type)}
                </Badge>
                <Badge className={getStatusColor(event.status)}>
                  {getStatusText(event.status)}
                </Badge>
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('ar-SA')}</span>
                <Clock className="w-4 h-4 mr-2" />
                <span>{event.time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{event.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{event.registered}/{event.capacity} مسجل</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-lg font-bold text-green-600">
                  {event.price === 0 ? 'مجاني' : `${event.price} ريال`}
                </div>
                <div className="text-sm text-gray-500">
                  المنظم: {event.organizer}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(event)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الفعالية</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">عنوان الفعالية</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">الوصف</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">نوع الفعالية</Label>
                <Select value={formData.type} onValueChange={(value: Event['type']) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">ورشة عمل</SelectItem>
                    <SelectItem value="seminar">ندوة</SelectItem>
                    <SelectItem value="conference">مؤتمر</SelectItem>
                    <SelectItem value="meetup">لقاء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">الحالة</Label>
                <Select value={formData.status} onValueChange={(value: Event['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">قادم</SelectItem>
                    <SelectItem value="ongoing">جاري</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">التاريخ</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-time">الوقت</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">المكان</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity">السعة</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">السعر (ريال)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-organizer">المنظم</Label>
              <Input
                id="edit-organizer"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingEvent(null)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdate}>حفظ التغييرات</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
