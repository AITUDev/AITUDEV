"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Code, Lightbulb, Award, ArrowRight } from 'lucide-react'
import { useState } from "react"

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    year: '',
    major: '',
    specialization: '',
    experience: '',
    motivation: '',
    portfolio: '',
    availability: [],
    agreeTerms: false
  })

  const requirements = [
    "Currently enrolled at Assiut International Technological University",
    "Basic programming knowledge in at least one language",
    "Passion for technology and continuous learning",
    "Commitment to attend regular meetings and events",
    "Willingness to collaborate and help fellow team members"
  ]

  const benefits = [
    {
      icon: <Code className="h-6 w-6 text-blue-500" />,
      title: "Skill Development",
      description: "Learn cutting-edge technologies through hands-on projects and workshops"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Networking",
      description: "Connect with like-minded students and industry professionals"
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-orange-500" />,
      title: "Innovation",
      description: "Work on real-world projects that make a difference"
    },
    {
      icon: <Award className="h-6 w-6 text-purple-500" />,
      title: "Recognition",
      description: "Gain certificates, recommendations, and portfolio projects"
    }
  ]

  const specializations = [
    "Web Development (Frontend)",
    "Web Development (Backend)",
    "Full-Stack Development",
    "Mobile App Development",
    "Artificial Intelligence & Machine Learning",
    "Data Science & Analytics",
    "UI/UX Design",
    "DevOps & Cloud Computing",
    "Cybersecurity",
    "Game Development",
    "IoT & Hardware",
    "Project Management"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">Join AITU Dev(Soooon)</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Ready to be part of an innovative tech community? Join us and accelerate your journey 
            in technology while making lasting connections and building amazing projects.
          </p>
        </div>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Why Join Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16 bg-gray-50 py-16 -mx-4 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-slate-800">Basic Requirements</h3>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-6 text-slate-800">Preferred Skills</h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">JavaScript</Badge>
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">Java</Badge>
                    <Badge variant="outline">C++</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">Flutter</Badge>
                    <Badge variant="outline">Django</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Git</Badge>
                    <Badge variant="outline">SQL</Badge>
                    <Badge variant="outline">Linux</Badge>
                    <Badge variant="outline">AWS</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Don't worry if you don't have all these skills - we'll help you learn!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Application Form</h2>
            <Card>
              <CardHeader>
                <CardTitle>Join Our Team</CardTitle>
                <CardDescription>
                  Fill out this form to apply for membership in AITU Dev. We'll review your application 
                  and get back to you within 5-7 business days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="Enter your full name"
                        required
                        readOnly

                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@aitu.edu.eg"
                        required
                        readOnly

                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+20 xxx xxx xxxx"
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentId">Student ID *</Label>
                      <Input
                        id="studentId"
                        value={formData.studentId}
                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                        placeholder="Your university student ID"
                        required
                        readOnly

                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Academic Year *</Label>
                      <Select onValueChange={(value) => setFormData({...formData, year: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">First Year</SelectItem>
                          <SelectItem value="2">Second Year</SelectItem>
                          <SelectItem value="3">Third Year</SelectItem>
                          <SelectItem value="4">Fourth Year</SelectItem>
                          <SelectItem value="graduate">Graduate Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="major">Major *</Label>
                      <Select onValueChange={(value) => setFormData({...formData, major: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your major" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="se">Software Engineering</SelectItem>
                          <SelectItem value="ai">Artificial Intelligence</SelectItem>
                          <SelectItem value="is">Information Systems</SelectItem>
                          <SelectItem value="it">Information Technology</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <Label htmlFor="specialization">Area of Interest *</Label>
                    <Select onValueChange={(value) => setFormData({...formData, specialization: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary area of interest" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec, index) => (
                          <SelectItem key={index} value={spec.toLowerCase().replace(/\s+/g, '-')}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience */}
                  <div>
                    <Label htmlFor="experience">Programming Experience *</Label>
                    <Select onValueChange={(value) => setFormData({...formData, experience: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-2 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Motivation */}
                  <div>
                    <Label htmlFor="motivation">Why do you want to join AITU Dev? *</Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                      placeholder="Tell us about your motivation, goals, and what you hope to contribute to the team..."
                      rows={4}
                      required
                      readOnly

                    />
                  </div>

                  {/* Portfolio */}
                  <div>
                    <Label htmlFor="portfolio">Portfolio/GitHub (Optional)</Label>
                    <Input
                      id="portfolio"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                      placeholder="https://github.com/yourusername or your portfolio website"
                      readOnly

                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <Label className="text-base font-medium">Availability (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {['Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons', 'Online Meetings', 'Workshops', 'Competitions'].map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <Checkbox id={time} />
                          <Label htmlFor={time} className="text-sm">{time}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData({...formData, agreeTerms: checked as boolean})}
                      required 
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the team's code of conduct and commit to actively participating in team activities. 
                      I understand that membership requires regular attendance and contribution to team projects. *
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!formData.agreeTerms}
                  >
                    Submit Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-slate-900 text-white py-16 -mx-4 px-4 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">What Happens Next?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Application Review</h3>
                <p className="text-gray-300">
                  Our team will review your application within 5-7 business days.
                </p>
              </div>
              <div>
                <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Interview</h3>
                <p className="text-gray-300">
                  If selected, you'll have a brief interview with our leadership team.
                </p>
              </div>
              <div>
                <div className="bg-orange-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome!</h3>
                <p className="text-gray-300">
                  Join our orientation session and start your journey with AITU Dev.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
