"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  status: string
  avatar: string
}

interface AddTeamMemberFormProps {
  onAddMember: (member: Omit<TeamMember, 'id'>) => void
}

export function AddTeamMemberForm({ onAddMember }: AddTeamMemberFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    status: 'active',
    avatar: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddMember(formData)
    setFormData({ name: '', role: '', status: 'active', avatar: '' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="w-4 h-4 mr-2" />
          إضافة عضو
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة عضو جديد للفريق</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-name">الاسم</Label>
            <Input
              id="member-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="أدخل اسم العضو"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="member-role">المنصب</Label>
            <Input
              id="member-role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="مثل: مطور، مصمم، مدير مشروع"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="member-status">الحالة</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="away">غائب</SelectItem>
                <SelectItem value="busy">مشغول</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">إضافة العضو</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
