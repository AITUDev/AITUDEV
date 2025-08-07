"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Mail, Phone, Linkedin, Github } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  email: string
  phone: string
  linkedin: string
  github: string
  avatar: string
  joinDate: string
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'أحمد محمد علي',
      position: 'المدير التنفيذي',
      bio: 'خبرة أكثر من 15 عاماً في مجال التكنولوجيا وإدارة الفرق. متخصص في استراتيجيات النمو والتطوير.',
      email: 'ahmed@company.com',
      phone: '+966501234567',
      linkedin: 'linkedin.com/in/ahmed-mohamed',
      github: 'github.com/ahmed-mohamed',
      avatar: '/professional-man.png',
      joinDate: '2020-01-15'
    },
    {
      id: '2',
      name: 'فاطمة عبدالرحمن',
      position: 'مديرة التطوير',
      bio: 'مهندسة برمجيات متمرسة مع خبرة واسعة في تطوير التطبيقات والأنظمة المعقدة.',
      email: 'fatima@company.com',
      phone: '+966507654321',
      linkedin: 'linkedin.com/in/fatima-abdulrahman',
      github: 'github.com/fatima-dev',
      avatar: '/professional-woman-diverse.png',
      joinDate: '2020-03-01'
    },
    {
      id: '3',
      name: 'محمد حسن الأحمد',
      position: 'مدير التصميم',
      bio: 'مصمم UI/UX مبدع مع شغف لإنشاء تجارب مستخدم استثنائية وتصاميم جذابة.',
      email: 'mohammed@company.com',
      phone: '+966509876543',
      linkedin: 'linkedin.com/in/mohammed-hassan',
      github: 'github.com/mohammed-design',
      avatar: '/creative-designer.png',
      joinDate: '2021-06-15'
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    joinDate: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      bio: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      joinDate: ''
    })
  }

  const handleAdd = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      ...formData,
      avatar: `/placeholder.svg?height=150&width=150&query=${formData.name}`
    }
    setTeamMembers([...teamMembers, newMember])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      email: member.email,
      phone: member.phone,
      linkedin: member.linkedin,
      github: member.github,
      joinDate: member.joinDate
    })
  }

  const handleUpdate = () => {
    if (!editingMember) return
    
    const updatedMember: TeamMember = {
      ...editingMember,
      ...formData
    }
    
    setTeamMembers(teamMembers.map(m => m.id === editingMember.id ? updatedMember : m))
    setEditingMember(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id))
  }

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">فريق القيادة</h1>
          <p className="text-gray-600">إدارة أعضاء فريق القيادة</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة عضو جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة عضو جديد للفريق</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">المنصب</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="المنصب الوظيفي"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">النبذة الشخصية</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="نبذة مختصرة عن العضو"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966501234567"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="github.com/username"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="joinDate">تاريخ الانضمام</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAdd}>إضافة العضو</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{member.name}</CardTitle>
              <CardDescription className="text-lg font-medium text-blue-600">
                {member.position}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{member.phone}</span>
                </div>
                {member.linkedin && (
                  <div className="flex items-center gap-2 text-sm">
                    <Linkedin className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{member.linkedin}</span>
                  </div>
                )}
                {member.github && (
                  <div className="flex items-center gap-2 text-sm">
                    <Github className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{member.github}</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 pt-2 border-t">
                انضم في: {new Date(member.joinDate).toLocaleDateString('ar-SA')}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(member)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(member.id)}
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
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات العضو</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">الاسم الكامل</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-position">المنصب</Label>
                <Input
                  id="edit-position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-bio">النبذة الشخصية</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">رقم الهاتف</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-linkedin">LinkedIn</Label>
                <Input
                  id="edit-linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-github">GitHub</Label>
                <Input
                  id="edit-github"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-joinDate">تاريخ الانضمام</Label>
              <Input
                id="edit-joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingMember(null)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdate}>حفظ التغييرات</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
