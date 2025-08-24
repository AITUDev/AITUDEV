"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Github, ExternalLink } from "lucide-react"

export interface Project {
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

export default function FeaturedProjects({
  projects,
  loading,
}: {
  projects: Project[]
  loading: boolean
}) {
  const featuredProjects = projects
    .filter((p) => p.status === "completed" || p.status === "active")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Projects</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover some of our latest and most innovative projects that showcase our team's capabilities.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
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
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <Code className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={project.status === "completed" ? "default" : "secondary"}>{project.status}</Badge>
                    <span className="text-sm text-gray-500">{project.progress}%</span>
                  </div>
                  <CardTitle className="mb-2 group-hover:text-blue-600 transition-colors">{project.name}</CardTitle>
                  <CardDescription className="mb-4">{project.description}</CardDescription>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{project.technologies.length - 3} more</Badge>
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
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
