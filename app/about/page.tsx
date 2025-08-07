import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Lightbulb, Award } from 'lucide-react'
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">About AITU Dev</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We are a passionate student tech team at Assiut International Technological University, 
            dedicated to fostering innovation, learning, and collaboration in the field of technology.
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-slate-900">Our Story</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    AITU Dev was founded in 2022 by a group of passionate computer science students who 
                    recognized the need for a collaborative tech community within our university. What started 
                    as a small study group has grown into one of the most active student organizations on campus.
                  </p>
                  <p>
                    Our team brings together students from various disciplines - computer science, software 
                    engineering, artificial intelligence, and information systems - creating a diverse 
                    environment where different perspectives drive innovation.
                  </p>
                  <p>
                    Today, we're proud to have mentored hundreds of students, completed dozens of projects, 
                    and established partnerships with leading tech companies in Egypt and beyond.
                  </p>
                </div>
              </div>
              <div>
                <Image
                  src="/collaborative-students-computers.png"
                  alt="AITU Dev team working together"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16 bg-gray-50 py-16 -mx-4 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center border-t-4 border-t-blue-500">
                <CardHeader>
                  <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Lightbulb className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-600">Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We encourage creative thinking and innovative solutions to real-world problems.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-orange-500">
                <CardHeader>
                  <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-orange-600">Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe in the power of teamwork and collective problem-solving.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-green-500">
                <CardHeader>
                  <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-600">Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We strive for excellence in everything we do, from code quality to project delivery.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-purple-500">
                <CardHeader>
                  <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-purple-600">Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We are committed to continuous learning and personal development.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Organizational Structure */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Organizational Structure</h2>
            <div className="space-y-8">
              {/* Leadership Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Leadership Team</CardTitle>
                  <CardDescription>
                    Our leadership team guides the strategic direction and ensures smooth operations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg">Team Leader</h3>
                      <p className="text-gray-600">Overall strategy and vision</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Target className="h-10 w-10 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-lg">Project Coordinator</h3>
                      <p className="text-gray-600">Project management and coordination</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Award className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-lg">Technical Lead</h3>
                      <p className="text-gray-600">Technical guidance and mentorship</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specialized Teams */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-purple-600">Development Teams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Web Development</Badge>
                        <span className="text-sm text-gray-600">Frontend & Backend</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Mobile Development</Badge>
                        <span className="text-sm text-gray-600">iOS & Android</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">AI/ML Team</Badge>
                        <span className="text-sm text-gray-600">Machine Learning & Data Science</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">DevOps Team</Badge>
                        <span className="text-sm text-gray-600">Infrastructure & Deployment</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-indigo-600">Support Teams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Design Team</Badge>
                        <span className="text-sm text-gray-600">UI/UX Design</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Content Team</Badge>
                        <span className="text-sm text-gray-600">Documentation & Blog</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Events Team</Badge>
                        <span className="text-sm text-gray-600">Workshops & Competitions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Outreach Team</Badge>
                        <span className="text-sm text-gray-600">Community & Partnerships</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Goals */}
        <section className="bg-slate-900 text-white py-16 -mx-4 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Goals</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Short-term Goals</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                    <span>Expand our membership to 100+ active students</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                    <span>Launch 5 major open-source projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                    <span>Organize monthly tech workshops and seminars</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                    <span>Establish partnerships with local tech companies</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Long-term Goals</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                    <span>Become the leading student tech organization in Egypt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                    <span>Create a startup incubator within the university</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                    <span>Develop industry-ready solutions for real-world problems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                    <span>Build a global network of tech professionals and alumni</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
