"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, Calendar, Eye, GitBranch, Globe, Plus, Trash2, X, Users, LayoutDashboard, Shield, Lock } from 'lucide-react'

import { useProjects } from '@/hooks/useProjects'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { useEvents } from '@/hooks/useEvents'
import { useBlog, BlogPost } from '@/hooks/useBlog'
import Image from 'next/image'
import { AddBlogForm } from '@/components/add-blog-form'
import AddEventForm from '@/components/add-event-form'
import { AddTeamMemberForm } from '@/components/add-team-member-form'
import { AddProjectForm } from '@/components/add-project-form'
import AuthCheck from './authCheck'
import Analytics from './analytics'
import Link from 'next/link'
import { TeamAccountsManager } from '@/components/dashboard/team-accounts-manager'

interface Activity {
  id: string
  user: string
  action: string
  time: string
  type: string
}

export default function DashboardPage() {
  const { projects, loading: projectsLoading, deleteProject } = useProjects()
  const { teamMembers, loading: teamLoading, deleteTeamMember } = useTeamMembers()
  const { events, loading: eventsLoading, deleteEvent } = useEvents()
  const { posts: blogs, loading: blogsLoading, deletePost: deleteBlog } = useBlog()

  const [activeTab, setActiveTab] = useState<'overview' | 'accounts'>('overview')
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showAddBlog, setShowAddBlog] = useState(false)

  // Calculate average project progress
  const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0)

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

  const sortedActivities = recentActivities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5)

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

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">

          {/* Navigation Bar Tabs */}
          <div className="flex items-center justify-between bg-white p-2 rounded-xl border shadow-sm px-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Overview & Content</span>
              </button>

              <button
                onClick={() => setActiveTab('accounts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'accounts'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Team Member Accounts</span>
              </button>
            </div>
          </div>

          {activeTab === 'accounts' ? (
            <TeamAccountsManager />
          ) : (
            <div className="space-y-6">
              {/* Overview Cards */}
              <Analytics />

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
                          {projects.slice(0, 2).map((project) => (
                            <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4">
                                {project.image?.url && (
                                  <Image
                                    src={project.image.url}
                                    alt={project.name}
                                    width={80}
                                    height={80}
                                    className="rounded-lg object-cover"
                                  />
                                )}
                                <div>
                                  <h3 className="font-medium">{project.name}</h3>
                                  <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
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
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project._id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Team Members Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Team Members</CardTitle>
                          <CardDescription>Manage your team roster</CardDescription>
                        </div>
                        <Button onClick={() => setShowAddMember(true)} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {teamLoading ? (
                        <div className="text-center py-4">Loading team members...</div>
                      ) : teamMembers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No team members yet. Add your first team member!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {teamMembers.slice(0, 4).map((member) => (
                            <div key={member._id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  {member.avatar?.url ? (
                                    <AvatarImage src={member.avatar.url} alt={member.name} />
                                  ) : null}
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="text-sm font-medium">{member.name}</h4>
                                  <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteMember(member._id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Events & Blogs Side Section */}
                <div className="space-y-6">
                  {/* Events */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Events</CardTitle>
                          <CardDescription>Upcoming workshops & events</CardDescription>
                        </div>
                        <Button onClick={() => setShowAddEvent(true)} size="sm" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {eventsLoading ? (
                        <div className="text-center py-4 text-sm text-gray-500">Loading events...</div>
                      ) : events.length === 0 ? (
                        <div className="text-center py-4 text-sm text-gray-500">No events found.</div>
                      ) : (
                        <div className="space-y-3">
                          {events.slice(0, 3).map((event) => (
                            <div key={event._id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                              <div>
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event._id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Blogs */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Blog Posts</CardTitle>
                          <CardDescription>Published articles</CardDescription>
                        </div>
                        <Button onClick={() => setShowAddBlog(true)} size="sm" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {blogsLoading ? (
                        <div className="text-center py-4 text-sm text-gray-500">Loading blogs...</div>
                      ) : blogs.length === 0 ? (
                        <div className="text-center py-4 text-sm text-gray-500">No blog posts found.</div>
                      ) : (
                        <div className="space-y-3">
                          {blogs.slice(0, 3).map((blog) => (
                            <div key={blog._id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                              <span className="font-medium text-gray-900 truncate">{blog.title}</span>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteBlog(blog._id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
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
