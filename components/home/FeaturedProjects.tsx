"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

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
  if (loading) {
    return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project._id} className="flex flex-col h-full">
          {project.image && (
            <div className="relative h-48 w-full">
              <img
                src={project.image.url}
                alt={project.name}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span 
                    key={tech} 
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {project.githubUrl && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1" 
                  asChild
                >
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </a>
                </Button>
              )}
              
              <Button className="flex-1" asChild>
                <Link href={`/projects/${project._id}`} className="flex items-center justify-center">
                  Details
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
