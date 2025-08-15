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

// Helper function to create a URL-friendly slug
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

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

  // Update the team member card to use the slug-based URL
  const renderTeamMemberCard = (member: TeamMember) => {
    const memberSlug = createSlug(member.name);
    
    return (
      <Link key={member._id} href={`/team/${memberSlug}`} passHref>
        <Card className="h-full transition-transform hover:scale-105 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                {member.avatar?.url ? (
                  <Image
                    src={member.avatar.url}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
              
              <div className="mt-2">
                <Badge className={getStatusColor(member.status)}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Badge>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {member.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {member.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{member.skills.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="mt-4 flex space-x-2">
                {member.githubUrl && (
                  <a 
                    href={member.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a 
                    href={member.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {member.portfolioUrl && (
                  <a 
                    href={member.portfolioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

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
          {loading ? (
            <div className="text-center py-12">Loading team members...</div>
          ) : filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map(member => renderTeamMemberCard(member))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No team members found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
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
