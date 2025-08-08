"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Code, Trophy, Calendar, Github, ExternalLink } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

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
}

interface TeamMember {
  _id: string
  name: string
  role: string
  status: string
  avatar?: { url: string; publicId: string }
  skills: string[]
  bio: string
}

interface Event {
  _id: string
  title: string
  description: string
  date: string
  isCompleted: boolean
  priority: string
  type: string
  location?: string
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, teamRes, eventsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/team-members'),
          fetch('/api/events')
        ])

        const [projectsData, teamData, eventsData] = await Promise.all([
          projectsRes.json(),
          teamRes.json(),
          eventsRes.json()
        ])

        if (projectsData.success) setProjects(projectsData.data)
        if (teamData.success) setTeamMembers(teamData.data)
        if (eventsData.success) setEvents(eventsData.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate real statistics
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const upcomingEvents = events.filter(e => !e.isCompleted && new Date(e.date) >= new Date()).length

  // Get featured projects (latest 3 completed or active projects)
  const featuredProjects = projects
    .filter(p => p.status === 'completed' || p.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  // Get featured team members (first 4 active members)
  const featuredMembers = teamMembers
    .filter(m => m.status === 'active')
    .slice(0, 4)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Image src="/logo.png" alt="AITU Dev" priority={true} width={100} height={100} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              AITU Dev
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100">
              Student Tech Team
            </p>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
              Developing skills in programming, software development, AI, and web/app development at Assiut International Technological University
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                <Link href="/join">
                  Join Our Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900" asChild>
                <Link href="/projects">
                  View Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {loading ? '...' : `${activeMembers}+`}
              </div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {loading ? '...' : `${projects.length}+`}
              </div>
              <div className="text-gray-600">Total Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {loading ? '...' : `${completedProjects}+`}
              </div>
              <div className="text-gray-600">Completed Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {loading ? '...' : `${upcomingEvents}+`}
              </div>
              <div className="text-gray-600">Upcoming Events</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              About AITU Dev
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We are a passionate community of students at Assiut International Technological University, 
              dedicated to learning and applying cutting-edge technologies. Our team focuses on practical 
              projects that solve real-world problems while building valuable skills in software development, 
              artificial intelligence, and innovation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Learn by Doing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe in hands-on learning through real projects that challenge us to grow and innovate.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Collaborative Spirit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our diverse team brings together different skills and perspectives to create amazing solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Excellence Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We strive for excellence in every project, pushing boundaries and setting new standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover some of our latest and most innovative projects that showcase our team's capabilities.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading projects...</div>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No projects available yet.</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Card key={project._id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    {project.image?.url ? (
                      <Image
                        src={project.image.url}
                        alt={project.name}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <Code className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{project.progress}%</span>
                    </div>
                    <CardTitle className="mb-2 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="mb-4">
                      {project.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get to know the talented individuals who make AITU Dev a thriving community of innovation.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading team members...</div>
            </div>
          ) : featuredMembers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No team members available yet.</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredMembers.map((member) => (
                <Card key={member._id} className="text-center group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      {member.avatar?.url ? (
                        <Image
                          src={member.avatar.url}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      {member.name}
                    </CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/team">
                Meet Full Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a beginner or experienced developer, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/join">
                Join Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900" asChild>
              <Link href="/contact">
                Get In Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
