import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Calendar, Users, Star } from 'lucide-react'
import Image from "next/image"

export default function ProjectsPage() {
  const projects = [
    {
      title: "Student Management System",
      description: "A comprehensive web application for managing student records, grades, and academic information with role-based access control.",
      longDescription: "This full-stack application provides a complete solution for educational institutions to manage student data, track academic progress, and facilitate communication between students, faculty, and administration.",
      image: "/student-management-dashboard.png",
      technologies: ["React", "Node.js", "MongoDB", "Express", "JWT"],
      category: "Web Development",
      status: "Completed",
      team: ["Ahmed Hassan", "Nour Abdel-Rahman", "Youssef Ibrahim"],
      startDate: "Jan 2024",
      endDate: "Apr 2024",
      githubUrl: "#",
      liveUrl: "#",
      featured: true,
      stars: 45
    },
    {
      title: "Campus Navigator App",
      description: "Mobile application helping students navigate the university campus with interactive maps, building information, and real-time updates.",
      longDescription: "A React Native mobile app that provides turn-by-turn navigation within the campus, displays building information, class schedules, and campus events.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["React Native", "Firebase", "Google Maps API", "Redux"],
      category: "Mobile Development",
      status: "In Progress",
      team: ["Maryam Saleh", "Omar Mahmoud", "Aya Farouk"],
      startDate: "Mar 2024",
      endDate: "Jun 2024",
      githubUrl: "#",
      liveUrl: "#",
      featured: true,
      stars: 32
    },
    {
      title: "AI Study Assistant",
      description: "An intelligent chatbot that helps students with their studies, answers academic questions, and provides personalized learning recommendations.",
      longDescription: "Using natural language processing and machine learning, this AI assistant can understand student queries and provide relevant academic support.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Python", "TensorFlow", "NLP", "Flask", "OpenAI API"],
      category: "Artificial Intelligence",
      status: "Completed",
      team: ["Omar Mahmoud", "Karim Mostafa", "Ahmed Hassan"],
      startDate: "Sep 2023",
      endDate: "Dec 2023",
      githubUrl: "#",
      liveUrl: "#",
      featured: true,
      stars: 67
    },
    {
      title: "University Event Management",
      description: "Platform for organizing and managing university events, workshops, and seminars with registration and attendance tracking.",
      longDescription: "A comprehensive event management system that allows organizers to create events, manage registrations, and track attendance.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Vue.js", "Laravel", "MySQL", "Bootstrap"],
      category: "Web Development",
      status: "Completed",
      team: ["Fatima Al-Zahra", "Nour Abdel-Rahman", "Youssef Ibrahim"],
      startDate: "Oct 2023",
      endDate: "Jan 2024",
      githubUrl: "#",
      liveUrl: "#",
      featured: false,
      stars: 28
    },
    {
      title: "Code Review Assistant",
      description: "AI-powered tool that analyzes code quality, suggests improvements, and helps maintain coding standards across projects.",
      longDescription: "An automated code review system that uses machine learning to identify potential issues and suggest improvements.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Python", "Machine Learning", "Git API", "Docker"],
      category: "Developer Tools",
      status: "In Progress",
      team: ["Omar Mahmoud", "Mohamed Ali", "Ahmed Hassan"],
      startDate: "Feb 2024",
      endDate: "May 2024",
      githubUrl: "#",
      liveUrl: null,
      featured: false,
      stars: 19
    },
    {
      title: "Digital Library System",
      description: "Online library management system with book cataloging, borrowing system, and digital resource access.",
      longDescription: "A complete digital library solution with search functionality, user management, and integration with digital resources.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Angular", "Spring Boot", "PostgreSQL", "Elasticsearch"],
      category: "Web Development",
      status: "Completed",
      team: ["Nour Abdel-Rahman", "Karim Mostafa", "Youssef Ibrahim"],
      startDate: "Jun 2023",
      endDate: "Sep 2023",
      githubUrl: "#",
      liveUrl: "#",
      featured: false,
      stars: 41
    },
    {
      title: "IoT Campus Monitoring",
      description: "IoT-based system for monitoring campus facilities including temperature, humidity, and occupancy levels.",
      longDescription: "A comprehensive IoT solution that collects environmental data from various campus locations and provides real-time monitoring.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Arduino", "Raspberry Pi", "Python", "InfluxDB", "Grafana"],
      category: "IoT & Hardware",
      status: "In Progress",
      team: ["Mohamed Ali", "Karim Mostafa", "Omar Mahmoud"],
      startDate: "Jan 2024",
      endDate: "Jul 2024",
      githubUrl: "#",
      liveUrl: null,
      featured: false,
      stars: 15
    },
    {
      title: "Student Portfolio Builder",
      description: "Web application that helps students create professional portfolios to showcase their projects and skills.",
      longDescription: "A user-friendly platform where students can build and customize their professional portfolios with templates and themes.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
      category: "Web Development",
      status: "Completed",
      team: ["Aya Farouk", "Nour Abdel-Rahman", "Ahmed Hassan"],
      startDate: "Nov 2023",
      endDate: "Feb 2024",
      githubUrl: "#",
      liveUrl: "#",
      featured: false,
      stars: 36
    }
  ]

  const categories = ["All", "Web Development", "Mobile Development", "Artificial Intelligence", "Developer Tools", "IoT & Hardware"]
  const statuses = ["All", "Completed", "In Progress", "Planning"]

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">Our Projects</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore the innovative projects developed by our team. From web applications to AI solutions, 
            we're constantly pushing the boundaries of technology and learning.
          </p>
        </div>

        {/* Project Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Total Projects</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">18</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">7</div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">300+</div>
              <div className="text-gray-600">GitHub Stars</div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Featured Projects</h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.filter(project => project.featured).map((project, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant={project.status === 'Completed' ? 'default' : 'secondary'}
                        className={project.status === 'Completed' ? 'bg-green-500' : 'bg-orange-500'}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="bg-white/90">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{project.stars}</span>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.team.length} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{project.startDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                    {project.liveUrl && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Projects */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">All Projects</h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={index === 0 ? "bg-blue-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={500}
                      height={200}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant={project.status === 'Completed' ? 'default' : 'secondary'}
                        className={`text-xs ${project.status === 'Completed' ? 'bg-green-500' : 'bg-orange-500'}`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{project.stars}</span>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="mb-3 text-xs">
                    {project.category}
                  </Badge>
                  
                  <CardDescription className="text-gray-600 mb-3 text-sm leading-relaxed">
                    {project.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{project.team.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{project.startDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Github className="h-3 w-3 mr-1" />
                      Code
                    </Button>
                    {project.liveUrl && (
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 -mx-4 px-4 rounded-lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Have a Project Idea?</h2>
            <p className="text-blue-100 mb-8">
              We're always looking for new challenges and opportunities to learn. 
              If you have a project idea or want to collaborate with us, let's talk!
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Propose a Project
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
