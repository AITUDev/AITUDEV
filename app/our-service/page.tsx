'use client'

import React, { useEffect, useState } from 'react'
import { Project } from '@/hooks/useProjects'
import { TeamMember } from '@/hooks/useTeamMembers'
import { Code, ArrowRight, Clock, DollarSign, Users, Layers, Zap } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Service {
  _id: string
  title: string
  description: string
  icon: string
  type: string
  price_per_hour?: number
  price_per_project?: number
  createdAt?: string
  updatedAt?: string
}

export default function OurServices() {
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [visibleCount, setVisibleCount] = useState<number>(6) // Number of items to show initially
  const router = useRouter()

  // Fetch all data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)
        const [servicesRes, projectsRes, teamRes] = await Promise.all([
          fetch('/api/our-service'),
          fetch('/api/projects'),
          fetch('/api/team-members'),
        ])
        const [servicesJson, projectsJson, teamJson] = await Promise.all([
          servicesRes.json(),
          projectsRes.json(),
          teamRes.json(),
        ])

        if (servicesJson?.success) setServices(servicesJson.data)
        else setError(servicesJson?.error || 'Failed to fetch services')

        if (projectsJson?.success) setProjects(projectsJson.data)
        if (teamJson?.success) setTeamMembers(teamJson.data)
      } catch (e) {
        console.error(e)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Safely get Lucide icon component
  const getIconComponent = (name: string): React.ElementType | null => {
    const key = (name || '').trim()
    const Comp = (LucideIcons as any)[key]
    if (!Comp) return null
    return (typeof Comp === 'function' || typeof Comp === 'object')
      ? (Comp as React.ElementType)
      : null
  }

  const categories = [
    { id: "digital-media", name: "Digital Media", icon: "Globe" },
    { id: "mobile-app", name: "Mobile App", icon: "Smartphone" },
    { id: "programming", name: "Programming", icon: "Server" },
    { id: "database", name: "Database", icon: "Database" },
    { id: "ai", name: "AI Intelligence", icon: "Cloud" },
    { id: "web-design", name: "Web Design", icon: "BarChart2" },
    { id: "management", name: "Web Management", icon: "Settings" },
    { id: "network", name: "Network", icon: "Zap" },
    { id: "desktop-app", name: "Desktop App", icon: "Laptop" },
  ]

  const stats = [
    { number: "+", value: teamMembers.length, label: "all team members" },
    {
      number: "+",
      value: [...new Set(teamMembers.flatMap(member => member.skills || []))].length,
      label: "all skills"
    },
    { number: "+", value: services.length, label: "all services" },
    { number: "+", value: projects.length, label: "all projects" },
  ]

  if (loading) return <div className="text-center h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="text-center h-screen flex items-center justify-center text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* ... (نفس الكود بتاع الهيرو والاستاتس زي ما عندك) ... */}

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
              What We Offer
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Professional Services</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              We deliver cutting-edge solutions tailored to your business needs, ensuring maximum efficiency and innovation.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>All Services</span>
              </button>
              {categories.map((cat) => {
                const IconComp = getIconComponent(cat.icon)
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
                    }`}
                  >
                    {IconComp ? <IconComp className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                    <span>{cat.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Services Grid */}
            {(() => {
              const filtered = activeCategory === 'all'
                ? services
                : services.filter(s => s.type === activeCategory)

              if (filtered.length === 0) {
                return <div className="text-center text-gray-500 mt-10">No services available yet. Check back soon.</div>
              }

              return (
                <div className="space-y-6 mt-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeCategory === 'all'
                        ? 'All Services'
                        : categories.find(c => c.id === activeCategory)?.name || 'Services'}
                    </h2>
                    <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                      Showing {filtered.length} {filtered.length === 1 ? 'service' : 'services'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.slice(0, visibleCount).map((service) => {
                      const IconComp = getIconComponent(service.icon)
                      const category = categories.find(cat => cat.id === service.type)

                      return (
                        <div
                          key={service._id}
                          onClick={() => router.push(`/our-service/${service._id}`)}
                          onKeyDown={(e) => e.key === 'Enter' && router.push(`/our-service/${service._id}`)}
                          className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-100"
                          role="button"
                          tabIndex={0}
                        >
                          <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                {IconComp ? <IconComp className="w-6 h-6" /> : <Code className="w-6 h-6" />}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {service.title}
                                </h3>
                                {category && (
                                  <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {category.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                            {/* Price */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              {service.price_per_hour && (
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                  <span>${service.price_per_hour}/hour</span>
                                </div>
                              )}
                              {service.price_per_project && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                                  <span>Project: ${service.price_per_project}+</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-4">
                              <Link
                                href="/contact"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium"
                              >
                                Contact us about this service <ArrowRight className="w-4 h-4 ml-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {filtered.length > visibleCount && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => setVisibleCount(prev => prev + 6)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Load More Services
                      </button>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      </section>
    </div>
  )
}
