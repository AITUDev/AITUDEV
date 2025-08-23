'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

type Service = {
  _id: string
  title: string
  description: string
  icon: string   // lucide-react icon name, e.g. 'Globe'
  type: string   // category id, e.g. 'web-design'
  price_per_hour?: number
  price_per_project?: number
  createdAt?: string
  updatedAt?: string
}

const getIconComponent = (name: string): React.ElementType | null => {
  const Comp = (LucideIcons as any)[name]
  if (!Comp) return null
  const t = typeof Comp
  return (t === 'function' || t === 'object') ? (Comp as React.ElementType) : null
}

export default function ServiceDetailsPage() {
  const params = useParams()
  const id = (params?.id as string) || ''
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchService = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/our-service/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('Service not found.')
          } else {
            setError('Failed to load service.')
          }
          setService(null)
          return
        }
        // NOTE: This endpoint returns the document directly (not { success, data }).
        const doc = await res.json()
        setService(doc)
      } catch (e) {
        console.error(e)
        setError('Failed to load service.')
        setService(null)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Service not found.'}</div>
      </div>
    )
  }

  const IconComp = getIconComponent(service.icon)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-14">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-blue-200 mb-3">
            <Link href="/our-service" className="hover:underline">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{service.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{service.title}</h1>
          <p className="text-blue-100 mt-2 max-w-3xl">
            Explore details about this service and how we can help your business.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white border rounded-xl shadow-sm p-6 md:p-8">
            {/* Title row */}
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                {IconComp ? <IconComp className="w-6 h-6 text-blue-600" /> : null}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">{service.title}</h2>
                <div className="inline-flex items-center text-sm text-gray-600 bg-gray-100 rounded px-2 py-0.5">
                  {service.type}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700">{service.description}</p>
            </div>

            {/* Pricing */}
            {(service.price_per_hour || service.price_per_project) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.price_per_hour !== undefined && (
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Hourly</div>
                      <div className="text-xl font-bold">
                        ${service.price_per_hour}/hour
                      </div>
                    </div>
                  )}
                  {service.price_per_project !== undefined && (
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Per Project</div>
                      <div className="text-xl font-bold">
                        ${service.price_per_project}+ 
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
              >
                Request a Quote
              </Link>
              <Link
                href="/contact"
                className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-6 rounded-lg border border-blue-600 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}