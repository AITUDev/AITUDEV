"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, ArrowUpRight, Calendar, Clock, Code, GitBranch, Globe, MoreHorizontal, Plus, TrendingUp, Users, Trash2, X, Shield, LogOut } from 'lucide-react'
import { AddProjectForm } from '@/dashboard/components/add-project-form'
import { AddTeamMemberForm } from '@/dashboard/components/add-team-member-form'
import AddEventForm from '@/dashboard/components/add-event-form'
import { AddBlogForm } from '@/dashboard/components/add-blog-form'
import { useProjects } from '@/hooks/useProjects'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { useEvents } from '@/hooks/useEvents'
import { useBlog, BlogPost } from '@/hooks/useBlog'
import Image from 'next/image'

interface Activity {
  id: string
  user: string
  action: string
  time: string
  type: string
}

// Simple authentication component
function AuthCheck({ children }: { children: React.ReactNode }) {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple authentication check

        if (email === process.env.NEXT_PUBLIC_DASHBOARD_EMAIL && password === process.env.NEXT_PUBLIC_DASHBOARD_PASS) {
      setIsAuthenticated(true)
      localStorage.setItem('dashboard_auth', 'true')
      localStorage.setItem('dashboard_email', email)
    } else {
      setError('Invalid credentials. Only aitudev member is authorized.')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('dashboard_auth')
    localStorage.removeItem('dashboard_email')
  }

  // Check if already authenticated on mount
  useEffect(() => {
    const auth = localStorage.getItem('dashboard_auth')
    const storedEmail = localStorage.getItem('dashboard_email')
            if (auth === 'true' && storedEmail === process.env.NEXT_PUBLIC_DASHBOARD_EMAIL) {
      setIsAuthenticated(true)
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              AITU Dev Dashboard
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Authorized access only
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">AITU Dev Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">aitudevelopment@gmail.com</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const { projects, loading: projectsLoading, deleteProject } = useProjects()
  const { teamMembers, loading: teamLoading, deleteTeamMember } = useTeamMembers()
  const { events, loading: eventsLoading, deleteEvent } = useEvents()
  const { posts: blogs, loading: blogsLoading, deletePost: deleteBlog } = useBlog()

  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showAddBlog, setShowAddBlog] = useState(false)

  // Calculate real statistics from database data
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const upcomingEvents = events.filter(e => !e.isCompleted && new Date(e.date) >= new Date()).length
  const completedEvents = events.filter(e => e.isCompleted).length


  // Calculate average project progress
  const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0)
  const averageProgress = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0

  // Generate recent activity from actual data
  const recentActivities: Activity[] = []

  // Add recent blogs (last 2)
  const recentBlogs = blogs
    .sort((a, b) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime())
    .slice(0, 2)

  recentBlogs.forEach(blog => {
    const timeAgo = getTimeAgo(blog.createdAt || blog.updatedAt)
    recentActivities.push({
      id: `blog-${blog._id}`,
      user: 'AITU Dev Team',
      action: `published blog "${blog.title}"`,
      time: timeAgo,
      type: 'blog'
    })
  })

  // Add recent projects (last 3)
  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime())
    .slice(0, 2)

  recentProjects.forEach(project => {
    const timeAgo = getTimeAgo(project.createdAt || project.updatedAt)
    recentActivities.push({
      id: `project-${project._id}`,
      user: 'AITU Dev Team',
      action: `${project.status === 'completed' ? 'completed' : 'updated'} project "${project.name}"`,
      time: timeAgo,
      type: 'project'
    })
  })

  // Add recent team members (last 2)
  const recentMembers = teamMembers
    .sort((a, b) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime())
    .slice(0, 2)

  recentMembers.forEach(member => {
    const timeAgo = getTimeAgo(member.createdAt || member.updatedAt)
    recentActivities.push({
      id: `member-${member._id}`,
      user: member.name,
      action: `joined the team as ${member.role}`,
      time: timeAgo,
      type: 'team'
    })
  })

  // Add recent events (last 2)
  const recentEvents = events
    .sort((a, b) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime())
    .slice(0, 2)

  recentEvents.forEach(event => {
    const timeAgo = getTimeAgo(event.createdAt || event.updatedAt)
    recentActivities.push({
      id: `event-${event._id}`,
      user: 'AITU Dev Team',
      action: `${event.isCompleted ? 'completed' : 'scheduled'} event "${event.title}"`,
      time: timeAgo,
      type: 'event'
    })
  })

  // Sort activities by most recent and limit to 5
  const sortedActivities = recentActivities
    .sort((a, b) => {
      // Sort by creation time (most recent first)
      return new Date(b.time).getTime() - new Date(a.time).getTime()
    })
    .slice(0, 5)

  // Helper function to calculate time ago
  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

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
      const result = await deleteBlog(id)
      if (!result.success) {
        alert('Failed to delete blog post: ' + result.error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeProjects} active • {completedProjects} completed
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
                  {activeMembers} active members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">
                  {upcomingEvents} upcoming • {completedEvents} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {blogs.length} posts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageProgress}%</div>
                <p className="text-xs text-muted-foreground">
                  Project completion rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Projects */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Projects</CardTitle>
                      <CardDescription>Manage your development projects</CardDescription>
                    </div>
                    <Button onClick={() => setShowAddProject(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="text-center py-4">Loading projects...</div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No projects yet. Create your first project!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            {project.image?.url && (
                              <Image
                                src={project.image.url}
                                alt={project.name}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-medium">{project.name}</h3>
                              <p className="text-sm text-gray-600">{project.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status}
                                </Badge>
                                <div className="flex items-center space-x-1">
                                  <Progress value={project.progress} className="w-20" />
                                  <span className="text-xs text-gray-500">{project.progress}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {project.githubUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <GitBranch className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {project.liveUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProject(project._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Events */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Events</CardTitle>
                      <CardDescription>Upcoming events and deadlines</CardDescription>
                    </div>
                    <Button onClick={() => setShowAddEvent(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="text-center py-4">Loading events...</div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No events scheduled. Create your first event!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.slice(0, 5).map((event) => (
                        <div key={event._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            {event.image?.url && (
                              <Image
                                src={event.image.url}
                                alt={event.title}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm text-gray-600">{event.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={getPriorityColor(event.priority)}>
                                  {event.priority}
                                </Badge>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(event.date).toLocaleDateString()}
                                </div>
                                {event.location && (
                                  <span className="text-sm text-gray-500">{event.location}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEvent(event._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Blog */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Blog</CardTitle>
                      <CardDescription>Upcoming blog posts</CardDescription>
                    </div>
                    <Button onClick={() => setShowAddBlog(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Blog
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {blogsLoading ? (
                    <div className="text-center py-4">Loading blog posts...</div>
                  ) : blogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No blog posts scheduled. Create your first blog post!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blogs.slice(0, 5).map((blog: BlogPost) => (
                        <div key={blog._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            {blog.images && blog.images.length > 0 && (
                              <Image
                                src={blog.images[0].url}
                                alt={blog.title}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-medium">{blog.title}</h3>
                              <p className="text-sm text-gray-600">{blog.excerpt}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="secondary">
                                  {blog.category}
                                </Badge>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(blog.createdAt).toLocaleDateString()}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {blog.readTime} read
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Team Members */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>Active team members</CardDescription>
                    </div>
                    <Button onClick={() => setShowAddMember(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {teamLoading ? (
                    <div className="text-center py-4">Loading team...</div>
                  ) : teamMembers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No team members yet. Add your first member!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {teamMembers.slice(0, 5).map((member) => (
                        <div key={member._id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={member.avatar?.url} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMember(member._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedActivities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No recent activity. Start by adding projects, team members, or events!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${activity.type === 'project' ? 'bg-blue-600' :
                            activity.type === 'team' ? 'bg-green-600' :
                              'bg-purple-600'
                            }`}></div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Add New Project</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddProject(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <AddProjectForm onClose={() => setShowAddProject(false)} />
              </div>
            </div>
          </div>
        )}

        {showAddMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Add Team Member</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddMember(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <AddTeamMemberForm onClose={() => setShowAddMember(false)} />
              </div>
            </div>
          </div>
        )}

        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Add New Event</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddEvent(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <AddEventForm onClose={() => setShowAddEvent(false)} />
              </div>
            </div>
          </div>
        )}
        {showAddBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Add Blog</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddBlog(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <AddBlogForm onClose={() => setShowAddBlog(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthCheck>
  )
}
