"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Calendar, Users, Code } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'paused'
  progress: number
  startDate: string
  endDate: string
  team: string[]
  technologies: string[]
  image: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'منصة التجارة الإلكترونية',
      description: 'تطوير منصة شاملة للتجارة الإلكترونية مع نظام دفع متقدم وإدارة المخزون',
      status: 'active',
      progress: 75,
      startDate: '2024-01-01',
      endDate: '2024-06-01',
      team: ['أحمد محمد', 'فاطمة علي', 'محمد حسن'],
      technologies: ['React', 'Node.js', 'MongoDB'],
      image: '/ecommerce-platform-concept.png'
    },
    {
      id: '2',
      title: 'تطبيق إدارة المهام',
      description: 'تطبيق جوال لإدارة المهام والمشاريع مع ميزات التعاون الجماعي',
      status: 'completed',
      progress: 100,
      startDate: '2023-09-01',
      endDate: '2023-12-01',
      team: ['سارة أحمد', 'علي محمود'],
      technologies: ['React Native', 'Firebase', 'TypeScript'],
      image: '/task-management-app-interface.png'
    },
    {
      id: '3',
      title: 'نظام إدارة المحتوى',
      description: 'نظام إدارة محتوى مخصص للمواقع الإخبارية والمدونات',
      status: 'paused',
      progress: 45,
      startDate: '2024-02-01',
      endDate: '2024-08-01',
      team: ['خالد عبدالله', 'نور الدين'],
      technologies: ['Next.js', 'PostgreSQL', 'Prisma'],
      image: '/content-management-system.png'
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active' as Project['status'],
    progress: 0,
    startDate: '',
    endDate: '',
    team: '',
    technologies: ''
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'active',
      progress: 0,
      startDate: '',
      endDate: '',
      team: '',
      technologies: ''
    })
  }

  const handleAdd = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      progress: formData.progress,
      startDate: formData.startDate,
      endDate: formData.endDate,
      team: formData.team.split(',').map(t => t.trim()),
      technologies: formData.technologies.split(',').map(t => t.trim()),
      image: `/placeholder.svg?height=200&width=300&query=${formData.title}`
    }
    setProjects([...projects, newProject])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      status: project.status,
      progress: project.progress,
      startDate: project.startDate,
      endDate: project.endDate,
      team: project.team.join(', '),
      technologies: project.technologies.join(', ')
    })
  }

  const handleUpdate = () => {
    if (!editingProject) return
    
    const updatedProject: Project = {
      ...editingProject,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      progress: formData.progress,
      startDate: formData.startDate,
      endDate: formData.endDate,
      team: formData.team.split(',').map(t => t.trim()),
      technologies: formData.technologies.split(',').map(t => t.trim())
    }
    
    setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p))
    setEditingProject(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'completed': return 'مكتمل'
      case 'paused': return 'متوقف'
      default: return status
    }
  }

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">إدارة المشاريع</h1>
          <p className="text-gray-600">إدارة وتتبع جميع المشاريع</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة مشروع جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة مشروع جديد</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان المشروع</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="أدخل عنوان المشروع"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف المشروع"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value: Project['status']) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="paused">متوقف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="progress">نسبة الإنجاز (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">تاريخ البداية</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">تاريخ النهاية</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team">أعضاء الفريق (مفصولة بفاصلة)</Label>
                <Input
                  id="team"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  placeholder="أحمد محمد, فاطمة علي, محمد حسن"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="technologies">التقنيات المستخدمة (مفصولة بفاصلة)</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAdd}>إضافة المشروع</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>التقدم</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{project.startDate} - {project.endDate}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{project.team.length} أعضاء</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Code className="w-4 h-4" />
                <span>{project.technologies.join(', ')}</span>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(project)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
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
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل المشروع</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">عنوان المشروع</Label>
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
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-status">الحالة</Label>
                <Select value={formData.status} onValueChange={(value: Project['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="paused">متوقف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-progress">نسبة الإنجاز (%)</Label>
                <Input
                  id="edit-progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDate">تاريخ البداية</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">تاريخ النهاية</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-team">أعضاء الفريق</Label>
              <Input
                id="edit-team"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-technologies">التقنيات المستخدمة</Label>
              <Input
                id="edit-technologies"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingProject(null)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdate}>حفظ التغييرات</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
