"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, ArrowUpRight, Calendar, Clock, Code, GitBranch, Globe, MoreHorizontal, Plus, TrendingUp, Users, Trash2, X } from 'lucide-react'
import { AddProjectForm } from './components/add-project-form'
import { AddTeamMemberForm } from './components/add-team-member-form'
import { AddEventForm } from './components/add-event-form'

interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
}

interface TeamMember {
  id: string
  name: string
  role: string
  status: string
  avatar: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  priority: string
  type: string
}

interface Activity {
  id: string
  user: string
  action: string
  time: string
  type: string
}

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Frontend Development', description: 'React application', status: 'active', progress: 85 },
    { id: '2', name: 'Backend API', description: 'Node.js API', status: 'active', progress: 72 },
    { id: '3', name: 'Database Setup', description: 'MongoDB configuration', status: 'completed', progress: 100 },
    { id: '4', name: 'Testing & QA', description: 'Quality assurance', status: 'active', progress: 45 }
  ])

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'أحمد محمد', role: 'مطور رئيسي', status: 'active', avatar: '/developer-working.png' },
    { id: '2', name: 'فاطمة علي', role: 'مصممة UI/UX', status: 'active', avatar: '/diverse-designers-brainstorming.png' },
    { id: '3', name: 'محمد حسن', role: 'مدير المشروع', status: 'away', avatar: '/diverse-team-manager.png' }
  ])

  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'إطلاق النسخة التجريبية', description: 'مرحلة الاختبار النهائي', date: '2024-01-10', priority: 'high', type: 'deadline' },
    { id: '2', title: 'مراجعة التصميم', description: 'موافقة UI/UX', date: '2024-01-13', priority: 'medium', type: 'review' },
    { id: '3', title: 'عرض للعميل', description: 'عرض التقدم', date: '2024-01-17', priority: 'low', type: 'meeting' },
    { id: '4', title: 'النشر في الإنتاج', description: 'تاريخ الإطلاق', date: '2024-01-24', priority: 'high', type: 'milestone' }
  ])

  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', user: 'أحمد محمد', action: 'رفع 3 commits إلى الفرع الرئيسي', time: 'منذ ساعتين', type: 'commit' },
    { id: '2', user: 'فاطمة علي', action: 'تحديث نظام التصميم', time: 'منذ 4 ساعات', type: 'design' },
    { id: '3', user: 'محمد حسن', action: 'إنشاء معلم جديد', time: 'منذ يوم', type: 'milestone' },
    { id: '4', user: 'النظام', action: 'نشر في الإنتاج', time: 'منذ يومين', type: 'deploy' }
  ])

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject = {
      ...projectData,
      id: Date.now().toString()
    }
    setProjects([...projects, newProject])
    
    // إضافة نشاط جديد
    const newActivity = {
      id: Date.now().toString(),
      user: 'أنت',
      action: `أضاف مشروع جديد: ${projectData.name}`,
      time: 'الآن',
      type: 'project'
    }
    setActivities([newActivity, ...activities])
  }

  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember = {
      ...memberData,
      id: Date.now().toString(),
      avatar: '/abstract-geometric-shapes.png'
    }
    setTeamMembers([...teamMembers, newMember])
    
    // إضافة نشاط جديد
    const newActivity = {
      id: Date.now().toString(),
      user: 'أنت',
      action: `أضاف عضو جديد للفريق: ${memberData.name}`,
      time: 'الآن',
      type: 'team'
    }
    setActivities([newActivity, ...activities])
  }

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString()
    }
    setEvents([...events, newEvent])
    
    // إضافة نشاط جديد
    const newActivity = {
      id: Date.now().toString(),
      user: 'أنت',
      action: `أضاف حدث جديد: ${eventData.title}`,
      time: 'الآن',
      type: 'event'
    }
    setActivities([newActivity, ...activities])
  }

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id)
    setProjects(projects.filter(p => p.id !== id))
    
    if (project) {
      const newActivity = {
        id: Date.now().toString(),
        user: 'أنت',
        action: `حذف المشروع: ${project.name}`,
        time: 'الآن',
        type: 'delete'
      }
      setActivities([newActivity, ...activities])
    }
  }

  const deleteTeamMember = (id: string) => {
    const member = teamMembers.find(m => m.id === id)
    setTeamMembers(teamMembers.filter(m => m.id !== id))
    
    if (member) {
      const newActivity = {
        id: Date.now().toString(),
        user: 'أنت',
        action: `أزال عضو الفريق: ${member.name}`,
        time: 'الآن',
        type: 'delete'
      }
      setActivities([newActivity, ...activities])
    }
  }

  const deleteEvent = (id: string) => {
    const event = events.find(e => e.id === id)
    setEvents(events.filter(e => e.id !== id))
    
    if (event) {
      const newActivity = {
        id: Date.now().toString(),
        user: 'أنت',
        action: `حذف الحدث: ${event.title}`,
        time: 'الآن',
        type: 'delete'
      }
      setActivities([newActivity, ...activities])
    }
  }

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'away': return 'bg-yellow-100 text-yellow-800'
      case 'busy': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'away': return 'غائب'
      case 'busy': return 'مشغول'
      case 'completed': return 'مكتمل'
      case 'paused': return 'متوقف'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200'
      case 'medium': return 'bg-yellow-50 border-yellow-200'
      case 'low': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالية'
      case 'medium': return 'متوسطة'
      case 'low': return 'منخفضة'
      default: return priority
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit': return '🔄'
      case 'design': return '🎨'
      case 'milestone': return '🎯'
      case 'deploy': return '🚀'
      case 'project': return '📁'
      case 'team': return '👥'
      case 'event': return '📅'
      case 'delete': return '🗑️'
      default: return '📝'
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">موقع Aitu للتطوير</h1>
            <p className="text-gray-600">لوحة تحكم مشروع التطوير</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              نشط
            </Badge>
            <AddProjectForm onAddProject={addProject} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الكوميتات</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> من الشهر الماضي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> من الأسبوع الماضي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">مشاهدات الصفحة</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,847</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+23%</span> من أمس
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الأداء</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+0.5%</span> وقت التشغيل
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Progress */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>تقدم المشاريع</CardTitle>
                  <CardDescription>معالم التطوير الحالية</CardDescription>
                </div>
                <AddProjectForm onAddProject={addProject} />
              </CardHeader>
              <CardContent className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{project.name}</span>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusText(project.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProject(project.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>أعضاء الفريق</CardTitle>
                  <CardDescription>المساهمون النشطون</CardDescription>
                </div>
                <AddTeamMemberForm onAddMember={addTeamMember} />
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                    <Badge className={getStatusColor(member.status)}>
                      {getStatusText(member.status)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTeamMember(member.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>النشاط الأخير</CardTitle>
                <CardDescription>آخر تحديثات المشروع</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteActivity(activity.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>الأحداث القادمة</CardTitle>
                  <CardDescription>التواريخ والمعالم المهمة</CardDescription>
                </div>
                <AddEventForm onAddEvent={addEvent} />
              </CardHeader>
              <CardContent className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className={`flex items-center justify-between p-3 rounded-lg border ${getPriorityColor(event.priority)}`}>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityBadge(event.priority)}>
                        {getPriorityText(event.priority)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEvent(event.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
