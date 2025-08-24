// Server Component: fetch data on the server to improve LCP
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Code, Trophy } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"

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

// Lightweight skeletons for dynamic sections
function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="animate-pulse border rounded-lg">
            <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 w-24 rounded" />
              <div className="h-5 bg-gray-200 w-2/3 rounded" />
              <div className="h-4 bg-gray-200 w-full rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const FeaturedProjectsSection = dynamic(() => import("@/components/home/FeaturedProjects"), {
  loading: () => <SectionSkeleton rows={3} />,
  ssr: false,
})

const TeamSection = dynamic(() => import("@/components/home/TeamSection"), {
  loading: () => (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse border rounded-lg p-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="h-5 bg-gray-200 w-1/2 mx-auto rounded mb-2" />
            <div className="h-4 bg-gray-200 w-2/3 mx-auto rounded" />
          </div>
        ))}
      </div>
    </div>
  ),
  ssr: false,
})

const CTASection = dynamic(() => import("@/components/home/CTASection"), { ssr: false })

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

export default async function HomePage() {
  let projects: Project[] = []
  let teamMembers: TeamMember[] = []
  let events: Event[] = []
  try {
    const [projectsRes, teamRes, eventsRes] = await Promise.all([
      fetch('/api/projects', { cache: 'no-store' }),
      fetch('/api/team-members', { cache: 'no-store' }),
      fetch('/api/events', { cache: 'no-store' }),
    ])
    const [projectsData, teamData, eventsData] = await Promise.all([
      projectsRes.json(),
      teamRes.json(),
      eventsRes.json(),
    ])
    if (projectsData?.success) projects = projectsData.data
    if (teamData?.success) teamMembers = teamData.data
    if (eventsData?.success) events = eventsData.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }

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
                <Image
                  src="/logo.png"
                  alt="AITU Dev"
                  priority={true}
                  fetchPriority="high"
                  width={100}
                  height={100}
                  sizes="100px"
                />
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
              <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-slate-900 text-black" asChild>
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
                {activeMembers}+
              </div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {projects.length}+
              </div>
              <div className="text-gray-600">Total Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {completedProjects}+
              </div>
              <div className="text-gray-600">Completed Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{`${upcomingEvents}+`}</div>
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

      {/* Featured Projects Section (dynamically loaded) */}
      <FeaturedProjectsSection projects={projects} loading={false} />

      {/* Team Section (dynamically loaded) */}
      <TeamSection teamMembers={teamMembers} loading={false} />

      {/* CTA Section (dynamically loaded) */}
      <CTASection />
    </div>
  )
}
