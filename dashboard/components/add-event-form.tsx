"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarPlus } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  date: string
  priority: string
  type: string
}

interface AddEventFormProps {
  onAddEvent: (event: Omit<Event, 'id'>) => void
}

export function AddEventForm({ onAddEvent }: AddEventFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    priority: 'medium',
    type: 'deadline'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddEvent(formData)
    setFormData({ title: '', description: '', date: '', priority: 'medium', type: 'deadline' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus className="w-4 h-4 mr-2" />
          إضافة حدث
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة حدث جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">عنوان الحدث</Label>
            <Input
              id="event-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="أدخل عنوان الحدث"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-description">الوصف</Label>
            <Textarea
              id="event-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="وصف الحدث"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-date">التاريخ</Label>
            <Input
              id="event-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-priority">الأولوية</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">عالية</SelectItem>
                <SelectItem value="medium">متوسطة</SelectItem>
                <SelectItem value="low">منخفضة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-type">نوع الحدث</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الحدث" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">موعد نهائي</SelectItem>
                <SelectItem value="meeting">اجتماع</SelectItem>
                <SelectItem value="review">مراجعة</SelectItem>
                <SelectItem value="milestone">معلم مهم</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">إضافة الحدث</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
