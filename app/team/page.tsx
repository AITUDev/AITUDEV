"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, Linkedin, Mail, ExternalLink, Search, Users, Code } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'

interface TeamMember {
  _id: string
  name: string
  role: string
  status: string
  avatar?: { url: string; publicId: string }
  skills: string[]
  bio: string
  email?: string
  githubUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
  joinDate: string
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team-members')
        const data = await response.json()

        if (data.success) {
          setTeamMembers(data.data)
        }
      } catch (error) {
        console.error('Error fetching team members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  // Filter team members based on search and filters
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = roleFilter === 'all' || member.role.toLowerCase().includes(roleFilter.toLowerCase())
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })


  // Get featured post (first published post marked as featured)
  const featuredPost = teamMembers.find((member: TeamMember) => member.status === 'active' && member._id)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'alumni': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  // Get unique roles for filter
  const uniqueRoles = [...new Set(teamMembers.map(member => member.role))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our Team
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Get to know the talented individuals who make AITU Dev a thriving community of innovation
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {loading ? '...' : teamMembers.length}
                </div>
                <div className="text-sm text-gray-300">Total Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {loading ? '...' : teamMembers.filter(m => m.status === 'active').length}
                </div>
                <div className="text-sm text-gray-300">Active Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {loading ? '...' : uniqueRoles.length}
                </div>
                <div className="text-sm text-gray-300">Different Roles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {loading ? '...' : [...new Set(teamMembers.flatMap(m => m.skills))].length}
                </div>
                <div className="text-sm text-gray-300">Unique Skills</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members, roles, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {uniqueRoles.map(role => (
                      <SelectItem key={role} value={role.toLowerCase()}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading team members...</div>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {teamMembers.length === 0 ? 'No Team Members Yet' : 'No Members Found'}
                </h3>
                <p className="text-gray-500">
                  {teamMembers.length === 0
                    ? 'We\'re building our team. Join us to be among the first!'
                    : 'Try adjusting your search or filters to find what you\'re looking for.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredMembers.map((member) => (
                  <Link href={`/team/${member._id}`} key={member._id}>
                    <Card className="group hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border border-gray-200 h-full flex flex-col">
                      <CardHeader className="text-center pb-4 flex-shrink-0">
                        <div className="relative mx-auto mb-4">
                          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-white shadow-lg">
                            {member.avatar?.url ? (
                              <Image
                                src={member.avatar.url}
                                alt={member.name}
                                width={128}
                                height={128}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <Users className="h-12 w-12 text-blue-400" />
                              </div>
                            )}
                          </div>
                          <div className="absolute -top-2 -right-2">
                            <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-blue-600 transition-colors text-lg">{member.name}</CardTitle>
                        <CardDescription className="font-medium text-blue-600">{member.role}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{member.bio}</p>
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.slice(0, 6).map(skill => (
                                <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                              ))}
                              {member.skills.length > 6 && (
                                <Badge variant="outline" className="text-xs">+{member.skills.length - 6} more</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mb-4">Member since {formatDate(member.joinDate)}</div>
                        </div>
                        <div className="flex gap-2 justify-center mt-auto">
                          {member.email && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`mailto:${member.email}`}><Mail className="h-4 w-4" /></Link>
                            </Button>
                          )}
                          {member.githubUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={member.githubUrl} target="_blank"><Github className="h-4 w-4" /></Link>
                            </Button>
                          )}
                          {member.linkedinUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={member.linkedinUrl} target="_blank"><Linkedin className="h-4 w-4" /></Link>
                            </Button>
                          )}
                          {member.portfolioUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={member.portfolioUrl} target="_blank"><ExternalLink className="h-4 w-4" /></Link>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Want to Join Our Team?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              We're always looking for passionate students who want to learn, grow, and build amazing projects together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
                <a href="/join">
                  Apply Now
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-slate-900" asChild>
                <a href="/contact">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
