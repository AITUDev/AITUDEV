'use client'

import { Project } from '@/hooks/useProjects'
import { TeamMember } from '@/hooks/useTeamMembers'
import { Code } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Service {
  _id: string
  title: string
  description: string
  icon: string // lucide icon name
  type: string // category id e.g., 'digital-media'
  price_per_hour?: number
  price_per_project?: number
  createdAt?: string
  updatedAt?: string
}

export default function OurServices() {
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const router = useRouter()

  // Fetch all required data together
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

  // Safely get Lucide icon component by name
  const getIconComponent = (name: string): React.ElementType | null => {
    const key = (name || '').trim()
    const Comp = (LucideIcons as any)[key]
    if (!Comp) return null
    // Lucide icons can be ForwardRef components (typeof 'object') or functions depending on build
    const t = typeof Comp
    return (t === 'function' || t === 'object') ? (Comp as React.ElementType) : null
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
  ];

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
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We offer comprehensive technical solutions to meet your business needs in the digital age
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}{stat.value}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="p-8">
            {/* 🟦 شريط الأيقونات (التنقل بين المجموعات) */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {/* All filter */}
              <button
                onClick={() => setActiveCategory('all')}
                className={`p-4 rounded-full shadow transition border ${
                  activeCategory === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-transparent'
                }`}
                title="All Services"
              >
                <Code className="w-6 h-6" />
              </button>
              {categories.map((cat) => {
                const IconComp = getIconComponent(cat.icon)
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`p-4 rounded-full shadow transition border ${
                      isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-transparent'
                    }`}
                    title={cat.name}
                    aria-pressed={isActive}
                  >
                    {IconComp ? <IconComp className="w-6 h-6" /> : <Code className="w-6 h-6" />}
                  </button>
                );
              })}
            </div>

            {/* عرض الخدمات وفق الفلتر */}
            {(() => {
              const filtered = activeCategory === 'all' ? services : services.filter(s => s.type === activeCategory)
              return (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      {activeCategory === 'all' ? 'All Services' : (categories.find(c => c.id === activeCategory)?.name || 'Services')}
                    </h2>
                    <div className="text-sm text-gray-500">{filtered.length} result(s)</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((service) => (
                      <div
                        key={service._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => router.push(`/our-service/${service._id}`)}
                        onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/our-service/${service._id}`) }}
                        className="cursor-pointer p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {(() => {
                            const IconComp = getIconComponent(service.icon)
                            return IconComp ? (
                              <IconComp className="w-5 h-5 text-blue-600 mt-1" />
                            ) : (
                              <Code className="w-5 h-5 text-blue-600 mt-1" />
                            )
                          })()}
                          <div>
                            <h3 className="text-lg font-semibold">{service.title}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                          </div>
                        </div>
                        {(service.price_per_hour || service.price_per_project) && (
                          <div className="text-sm text-gray-500 mt-2">
                            {service.price_per_hour && <div>From ${service.price_per_hour}/hour</div>}
                            {service.price_per_project && <div>Project: ${service.price_per_project}+</div>}
                          </div>
                        )}
                        <div className="mt-4">
                          <Link href="/contact" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline text-sm">Contact us about this service →</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
            {services.length === 0 && (
              <div className="text-center text-gray-500">No services available yet. Check back soon.</div>
            )}
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Are you ready to start your next project?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Contact us today and we'll help you turn your ideas into a reality
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200">
              Request a Quote
            </Link>
            <Link href="/contact" className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-8 rounded-lg border border-blue-600 transition duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div >
  )
}