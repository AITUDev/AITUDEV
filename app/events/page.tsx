"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Clock, Award, ExternalLink, Search, Filter } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'

interface Event {
  _id: string
  title: string
  description: string
  date: string
  isCompleted: boolean
  priority: string
  type: string
  location?: string
  capacity?: number
  attendees: Array<{
    _id: string
    name: string
    email: string
    avatar?: { url: string; publicId: string }
  }>
  image?: { url: string; publicId: string }
  createdAt: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        const data = await response.json()

        if (data.success) {
          setEvents(data.data)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'upcoming' && !event.isCompleted && new Date(event.date) >= new Date()) ||
      (statusFilter === 'completed' && event.isCompleted) ||
      (statusFilter === 'past' && !event.isCompleted && new Date(event.date) < new Date())

    const matchesType = typeFilter === 'all' || event.type.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesType
  })

  // Separate events into upcoming and past
  const upcomingEvents = filteredEvents.filter(event => !event.isCompleted && new Date(event.date) >= new Date())
  const pastEvents = filteredEvents.filter(event => event.isCompleted || new Date(event.date) < new Date())

  const getStatusColor = (event: Event) => {
    if (event.isCompleted) return 'bg-blue-100 text-blue-800'
    if (new Date(event.date) >= new Date()) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (event: Event) => {
    if (event.isCompleted) return 'Completed'
    if (new Date(event.date) >= new Date()) return 'Upcoming'
    return 'Past'
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get unique types for filter
  const uniqueTypes = [...new Set(events.map(event => event.type))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Events & Workshops
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Join our community events, workshops, and learning sessions
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {loading ? '...' : events.length}
                </div>
                <div className="text-sm text-gray-300">Total Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {loading ? '...' : upcomingEvents.length}
                </div>
                <div className="text-sm text-gray-300">Upcoming</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {loading ? '...' : events.filter(e => e.isCompleted).length}
                </div>
                <div className="text-sm text-gray-300">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {loading ? '...' : events.reduce((total, event) => total + event.attendees.length, 0)}
                </div>
                <div className="text-sm text-gray-300">Total Attendees</div>
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
                  placeholder="Search events, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading events...</div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {events.length === 0 ? 'No Events Yet' : 'No Events Found'}
                </h3>
                <p className="text-gray-500">
                  {events.length === 0
                    ? 'We\'re planning exciting events. Stay tuned!'
                    : 'Try adjusting your search or filters to find what you\'re looking for.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                      <Calendar className="h-8 w-8 text-green-600" />
                      Upcoming Events
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {upcomingEvents.map((event) => (
                        <Link href={`/events/${event._id}`} key={event._id}>

                          <Card key={event._id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-l-green-500">
                            <CardHeader className="p-0">
                              {event.image?.url ? (
                                <div className="relative overflow-hidden">
                                  <Image
                                    src={event.image.url}
                                    alt={event.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute top-4 left-4 flex gap-2">
                                    <Badge className={getStatusColor(event)}>
                                      {getStatusText(event)}
                                    </Badge>
                                    <Badge className={getPriorityColor(event.priority)}>
                                      {event.priority}
                                    </Badge>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative">
                                  <Calendar className="h-16 w-16 text-green-400" />
                                  <div className="absolute top-4 left-4 flex gap-2">
                                    <Badge className={getStatusColor(event)}>
                                      {getStatusText(event)}
                                    </Badge>
                                    <Badge className={getPriorityColor(event.priority)}>
                                      {event.priority}
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </CardHeader>

                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <CardTitle className="group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {event.title}
                                </CardTitle>
                                <Badge variant="outline" className="ml-2 shrink-0">
                                  {event.type}
                                </Badge>
                              </div>

                              <CardDescription className="mb-4 line-clamp-3">
                                {event.description}
                              </CardDescription>

                              {/* Event Details */}
                              <div className="space-y-2 mb-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-blue-500" />
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-orange-500" />
                                  <span>{formatTime(event.date)}</span>
                                </div>
                                {event.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-500" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-purple-500" />
                                  <span>
                                    {event.attendees.length} registered
                                    {event.capacity && ` / ${event.capacity} capacity`}
                                  </span>
                                </div>
                              </div>

                              {/* Attendees Preview */}
                              {event.attendees.length > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="flex -space-x-2">
                                    {event.attendees.slice(0, 3).map((attendee) => (
                                      <div key={attendee._id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                                        {attendee.avatar?.url ? (
                                          <Image
                                            src={attendee.avatar.url}
                                            alt={attendee.name}
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                                            <Users className="h-3 w-3 text-blue-600" />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  {event.attendees.length > 3 && (
                                    <span className="text-sm text-gray-500">
                                      +{event.attendees.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}

                              <Button className="w-full bg-green-600 hover:bg-green-700">
                                Register Now
                              </Button>
                            </CardContent>
                          </Card>
                        </Link>

                      ))}
                    </div>
                  </div>
                )}

                {/* Past Events */}
                {pastEvents.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                      <Award className="h-8 w-8 text-blue-600" />
                      Past Events
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {pastEvents.map((event) => (
                        <Link href={`/events/${event._id}`} passHref key={event._id} >
                          <Card key={event._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden opacity-90">
                            <CardHeader className="p-0">
                              {event.image?.url ? (
                                <div className="relative overflow-hidden">
                                  <Image
                                    src={event.image.url}
                                    alt={event.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                  />
                                  <div className="absolute top-4 left-4">
                                    <Badge className={getStatusColor(event)}>
                                      {getStatusText(event)}
                                    </Badge>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                                  <Calendar className="h-12 w-12 text-gray-400" />
                                  <div className="absolute top-4 left-4">
                                    <Badge className={getStatusColor(event)}>
                                      {getStatusText(event)}
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </CardHeader>

                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <CardTitle className="text-lg line-clamp-2">
                                  {event.title}
                                </CardTitle>
                                <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                                  {event.type}
                                </Badge>
                              </div>

                              <CardDescription className="mb-3 line-clamp-2 text-sm">
                                {event.description}
                              </CardDescription>

                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{event.attendees.length} attended</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section >
    </div >
  )
}
