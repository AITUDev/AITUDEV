'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Import components dynamically with SSR disabled
const FeaturedProjects = dynamic(
  () => import('@/components/home/FeaturedProjects'),
  { ssr: false }
)

const TeamSection = dynamic(
  () => import('@/components/home/TeamSection'),
  { ssr: false }
)

const CTASection = dynamic(
  () => import('@/components/home/CTASection'),
  { ssr: false }
)

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
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
  }
  joinDate: string
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState({
    projects: true,
    team: true
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات المشاريع
        const projectsResponse = await fetch('/api/projects')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData)
        }

        // جلب بيانات أعضاء الفريق
        const teamResponse = await fetch('/api/team-members')
        if (teamResponse.ok) {
          const teamData = await teamResponse.json()
          setTeamMembers(teamData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(prev => ({
          ...prev,
          projects: false,
          team: false
        }))
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Welcome to AITU Dev Community
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering developers through collaboration, learning, and innovation
        </p>
      </section>

      {/* Featured Projects Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Featured Projects</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore our latest and most innovative projects created by our talented team
          </p>
        </div>
        <FeaturedProjects 
          projects={projects} 
          loading={loading.projects} 
        />
      </section>

      {/* Team Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Our Team</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Meet the brilliant minds behind our success and innovation
          </p>
        </div>
        <TeamSection 
          teamMembers={teamMembers} 
          loading={loading.team}
        />
      </section>

      {/* قسم الـ CTA */}
      <CTASection />
    </div>
  )
}
