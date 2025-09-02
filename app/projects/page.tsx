"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, ExternalLink, Calendar, Users, Star, Search, Code } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'

interface Project {
  _id: string
  name: string
  description: string
  status: string
  progress: number
  image?: { url: string; publicId: string }
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  createdAt: string
  updatedAt: string
  teamMembers?: string[]
  priority: string
  projectType?: 'mobile' | 'web' | 'network' | 'design' | 'software' | 'video game' | 'video' | 'other' | 'hardware'
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()

        if (data.success) {
          setProjects(data.data)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter
    const matchesType = typeFilter === 'all' || project.projectType === typeFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + pageSize)

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
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Projects
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Explore the innovative projects built by our talented team members
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {loading ? '...' : projects.length}
                </div>
                <div className="text-sm text-gray-300">Total Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {loading ? '...' : projects.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-300">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {loading ? '...' : projects.filter(p => p.status === 'active').length}
                </div>
                <div className="text-sm text-gray-300">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {loading ? '...' : [...new Set(projects.flatMap(p => p.technologies))].length}
                </div>
                <div className="text-sm text-gray-300">Technologies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
  <div className="container mx-auto px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects, technologies..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 w-full"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={(val) => {
              setPriorityFilter(val)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(val) => {
              setTypeFilter(val)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="mobile">Mobile App</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="video game">Video Game</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading projects...</div>
              </div>
            ) : paginatedProjects.length === 0 ? (
              <div className="text-center py-12">
                <Code className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {projects.length === 0 ? 'No Projects Yet' : 'No Projects Found'}
                </h3>
                <p className="text-gray-500">
                  {projects.length === 0
                    ? 'Our team is working on exciting projects. Check back soon!'
                    : 'Try adjusting your search or filters to find what you\'re looking for.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedProjects.map((project) => (
                    <Link key={project._id} href={`/projects/${project._id}`}>
                      <Card key={project._id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                        <CardHeader className="p-0">
                          {project.image?.url ? (
                            <div className="relative overflow-hidden">
                              <Image
                                src={project.image.url}
                                alt={project.name}
                                width={400}
                                height={240}
                                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status}
                                </Badge>
                                <Badge className={getPriorityColor(project.priority)}>
                                  {project.priority}
                                </Badge>
                              </div>
                              <div className="absolute top-4 right-4">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                                  {project.progress}%
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-60 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                              <Code className="h-16 w-16 text-gray-400" />
                              <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status}
                                </Badge>
                                <Badge className={getPriorityColor(project.priority)}>
                                  {project.priority}
                                </Badge>
                              </div>
                              <div className="absolute top-4 right-4">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                                  {project.progress}%
                                </div>
                              </div>
                            </div>
                          )}
                        </CardHeader>

                        <CardContent className="p-6">
                          <CardTitle className="mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {project.name}
                          </CardTitle>

                          <CardDescription className="mb-4 line-clamp-3">
                            {project.description}
                          </CardDescription>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.slice(0, 4).map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.technologies.length - 4} more
                              </Badge>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Meta Information */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(project.createdAt)}</span>
                            </div>
                            {project.teamMembers && project.teamMembers.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{project.teamMembers.length} members</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {project.githubUrl && (
                              <Button size="sm" variant="outline" className="flex-1" asChild>
                                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4 mr-2" />
                                  Code
                                </Link>
                              </Button>
                            )}
                            {project.liveUrl && (
                              <Button size="sm" variant="outline" className="flex-1" asChild>
                                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Demo
                                </Link>
                              </Button>
                            )}
                            {!project.githubUrl && !project.liveUrl && (
                              <Button size="sm" variant="outline" className="flex-1" disabled>
                                <Code className="h-4 w-4 mr-2" />
                                In Development
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-10 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Previous
                    </Button>

                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
