"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, ArrowUpRight, Calendar, Clock, Code, GitBranch, Globe, MoreHorizontal, Plus, TrendingUp, Users, Trash2, X, BookOpen, Eye, Heart } from 'lucide-react'
import { AddProjectForm } from './components/add-project-form'
import { AddTeamMemberForm } from './components/add-team-member-form'
import { AddBlogForm } from './components/add-blog-form'
import AddEventForm from './components/add-event-form'
import { useProjects } from '@/hooks/useProjects'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { useEvents } from '@/hooks/useEvents'
import { useBlog } from '@/hooks/useBlog'
import Image from 'next/image'

interface Activity {
  id: string
  user: string
  action: string
  time: string
  type: string
}

export default function ProjectDashboard() {
  const { projects, loading: projectsLoading, deleteProject } = useProjects()
  const { teamMembers, loading: teamLoading, deleteTeamMember } = useTeamMembers()
  const { events, loading: eventsLoading, deleteEvent } = useEvents()
  const { posts, loading: blogLoading, deletePost } = useBlog()
  
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showAddBlog, setShowAddBlog] = useState(false)

  // Mock activity data - you can create an API for this later
  const activities: Activity[] = [
    { id: '1', user: 'Ahmed Ali', action: 'created new project', time: '2 hours ago', type: 'project' },
    { id: '2', user: 'Sara Mohamed', action: 'updated team member profile', time: '4 hours ago', type: 'team' },
    { id: '3', user: 'Omar Hassan', action: 'completed event', time: '1 day ago', type: 'event' },
  ]

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      await deleteTeamMember(id)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id)
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      await deletePost(id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'paused': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (projectsLoading || teamLoading || eventsLoading || blogLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AITU Dev Dashboard</h1>
            <p className="text-gray-600">Manage your projects, team, events, and blog</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddProject(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
            <Button onClick={() => setShowAddMember(true)} variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Add Member
            </Button>
            <Button onClick={() => setShowAddEvent(true)} variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Add Event
            </Button>
            <Button onClick={() => setShowAddBlog(true)} variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Add Blog Post
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                {projects.filter(p => p.status === 'active').length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                {teamMembers.filter(m => m.status === 'active').length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => !e.isCompleted && new Date(e.date) > new Date()).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {events.filter(e => e.priority === 'urgent').length} urgent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-xs text-muted-foreground">
                {posts.filter(p => p.published).length} published
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.length > 0 
                  ? Math.round((projects.reduce((acc, p) => acc + p.progress, 0) / projects.length))
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Average progress</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Active Projects
                <Button size="sm" onClick={() => setShowAddProject(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {project.image?.url && (
                      <Image
                        src={project.image.url}
                        alt={project.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Progress value={project.progress} className="w-20 h-2" />
                        <span className="text-xs text-gray-500">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {project.githubUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <GitBranch className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-gray-500 py-4">No projects yet. Add your first project!</p>
              )}
            </CardContent>
          </Card>

          {/* Blog Posts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Blog Posts
                <Button size="sm" onClick={() => setShowAddBlog(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post._id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-start space-x-3 flex-1">
                    {post.images && post.images.length > 0 && (
                      <Image
                        src={post.images[0].url}
                        alt={post.title}
                        width={60}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-1">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.featured && <Badge className="bg-blue-500">Featured</Badge>}
                        {!post.published && <Badge variant="outline">Draft</Badge>}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>By {post.author}</span>
                        <span>{post.readTime}</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBlog(post._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-center text-gray-500 py-4">No blog posts yet. Create your first post!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Members Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Team Members
                <Button size="sm" onClick={() => setShowAddMember(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.slice(0, 5).map((member) => (
                <div key={member._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar?.url} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        {member.skills.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteMember(member._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <p className="text-center text-gray-500 py-4">No team members yet. Add your first member!</p>
              )}
            </CardContent>
          </Card>

          {/* Events Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Events
                <Button size="sm" onClick={() => setShowAddEvent(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events
                .filter(event => !event.isCompleted && new Date(event.date) > new Date())
                .slice(0, 5)
                .map((event) => (
                <div key={event._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {event.image?.url && (
                      <Image
                        src={event.image.url}
                        alt={event.title}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getPriorityColor(event.priority)}>
                          {event.priority}
                        </Badge>
                        <Badge variant="outline">{event.type}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              {events.filter(e => !e.isCompleted && new Date(e.date) > new Date()).length === 0 && (
                <p className="text-center text-gray-500 py-4">No upcoming events. Add your first event!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Add Project Modal */}
        {showAddProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Project</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddProject(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AddProjectForm onClose={() => setShowAddProject(false)} />
            </div>
          </div>
        )}

        {/* Add Team Member Modal */}
        {showAddMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Team Member</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddMember(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AddTeamMemberForm onClose={() => setShowAddMember(false)} />
            </div>
          </div>
        )}

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Event</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddEvent(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AddEventForm onClose={() => setShowAddEvent(false)} />
            </div>
          </div>
        )}

        {/* Add Blog Modal */}
        {showAddBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Blog Post</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddBlog(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AddBlogForm onClose={() => setShowAddBlog(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
