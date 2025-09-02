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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // عدد العناصر في الصفحة
  const router = useRouter()

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

  const getIconComponent = (name: string): React.ElementType | null => {
    const key = (name || '').trim()
    const Comp = (LucideIcons as any)[key]
    if (!Comp) return null
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

  // فلترة حسب الكاتيجوري
  const filtered = activeCategory === 'all'
    ? services
    : services.filter(s => s.type === activeCategory)

  // حساب بيانات الـ pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen bg-white">
      {/* باقي الكود زي ما هو ... */}

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="p-8">
            {/* الفلترة بالأيقونات */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {/* All filter */}
              <button
                onClick={() => { setActiveCategory('all'); setCurrentPage(1) }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl shadow transition border min-w-[90px] ${activeCategory === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-transparent'
                  }`}
                title="All Services"
              >
                <Code className="w-8 h-8" />
                <span className="text-xs font-medium">All</span>
              </button>

              {categories.map((cat) => {
                const IconComp = getIconComponent(cat.icon)
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setCurrentPage(1) }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl shadow transition border min-w-[90px] ${isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-transparent'
                      }`}
                    title={cat.name}
                  >
                    {IconComp ? (
                      <IconComp className="w-8 h-8" />
                    ) : (
                      <Code className="w-8 h-8" />
                    )}
                    <span className="text-xs font-medium">{cat.name}</span>
                  </button>
                )
              })}
            </div>


            {/* عرض الخدمات مع pagination */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {activeCategory === 'all' ? 'All Services' : (categories.find(c => c.id === activeCategory)?.name || 'Services')}
              </h2>
              <div className="text-sm text-gray-500">{filtered.length} result(s)</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((service) => (
                <div
                  key={service._id}
                  onClick={() => router.push(`/our-service/${service._id}`)}
                  className="cursor-pointer p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {(() => {
                      const IconComp = getIconComponent(service.icon)
                      return IconComp
                        ? <IconComp className="w-5 h-5 text-blue-600 mt-1" />
                        : <Code className="w-5 h-5 text-blue-600 mt-1" />
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
                    <Link href="/contact" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline text-sm">
                      Contact us about this service →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
