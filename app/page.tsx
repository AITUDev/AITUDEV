import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Code, Trophy, Calendar, Github, ExternalLink } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Image src="/logo.png" alt="AITU Dev" priority={true} width={100} height={100} />
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
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Join Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 text-black">
                View Projects
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
              <div className="text-3xl font-bold text-slate-900 mb-2">50+</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">25+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">15+</div>
              <div className="text-gray-600">Workshops Held</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">10+</div>
              <div className="text-gray-600">Competitions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Our Vision & Mission</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-blue-600">Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    To develop the skills of team members and university students in programming, software development, 
                    artificial intelligence, and web and application development.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-orange-600">Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    To build a tech community within the university that supports self-learning and teamwork, 
                    and prepares students for the job market.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Featured Projects</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Image
                    src="/web-application-dashboard.png"
                    alt="Student Management System"
                    width={400}
                    height={200}
                    className="rounded-lg object-cover w-full"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">Student Management System</CardTitle>
                  <CardDescription className="mb-4">
                    A comprehensive web application for managing student records and academic information.
                  </CardDescription>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">MongoDB</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Image
                    src="/mobile-app-interface.png"
                    alt="Campus Navigator App"
                    width={400}
                    height={200}
                    className="rounded-lg object-cover w-full"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">Campus Navigator App</CardTitle>
                  <CardDescription className="mb-4">
                    Mobile application to help students navigate the university campus with interactive maps.
                  </CardDescription>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">React Native</Badge>
                    <Badge variant="secondary">Firebase</Badge>
                    <Badge variant="secondary">Maps API</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Image
                    src="/ai-chatbot-interface.png"
                    alt="AI Study Assistant"
                    width={400}
                    height={200}
                    className="rounded-lg object-cover w-full"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">AI Study Assistant</CardTitle>
                  <CardDescription className="mb-4">
                    An intelligent chatbot that helps students with their studies and answers academic questions.
                  </CardDescription>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">Python</Badge>
                    <Badge variant="secondary">TensorFlow</Badge>
                    <Badge variant="secondary">NLP</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Our Achievements</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-orange-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1st Place</h3>
                <p className="text-gray-300">University Hackathon 2024</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Team</h3>
                <p className="text-gray-300">Regional Programming Contest</p>
              </div>
              <div className="text-center">
                <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation Award</h3>
                <p className="text-gray-300">Tech Innovation Summit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Tech Community?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Be part of a dynamic team that's shaping the future of technology at AITU. 
            Develop your skills, work on exciting projects, and prepare for your career.
          </p>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
            Apply Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
