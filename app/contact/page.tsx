"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Calendar } from 'lucide-react'
import { useState } from "react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  })

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-blue-500" />,
      title: "Email",
      details: "aitudevelopment@gmail.com",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="h-6 w-6 text-green-500" />,
      title: "Phone",
      details: "+20 155 971 5645",
      description: "Call us during office hours"
    },
    {
      icon: <MapPin className="h-6 w-6 text-orange-500" />,
      title: "Location",
      details: "AITU Campus, Assiut",
      description: "Building 3, Computer Lab A"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      title: "Office Hours",
      details: "Sun-Thu: 2PM-6PM",
      description: "Available for meetings"
    }
  ]

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61571366154516",
      icon: "📘",
      followers: "2.5K"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/aitudevelopers?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      icon: "📷",
      followers: "1.8K"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/aitu-dev/",
      icon: "💼",
      followers: "3.2K"
    },
    {
      name: "GitHub",
      url: "https://github.com/aitudev",
      icon: "🐙",
      followers: "1.5K"
    },
    {
      name: "Discord",
      url: "https://discord.gg/aitudev",
      icon: "🎮",
      followers: "800"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@aitudev",
      icon: "📺",
      followers: "950"
    }
  ]

  const quickActions = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Join Our Team",
      description: "Interested in becoming a member?",
      action: "Apply Now",
      link: "/join"
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: "Attend Events",
      description: "Check out our upcoming workshops",
      action: "View Events",
      link: "/events"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-orange-500" />,
      title: "Collaborate",
      description: "Have a project idea?",
      action: "Let's Talk",
      link: "#contact-form"
    }
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
          <h1 className="text-4xl font-bold mb-6 text-slate-900">Get in Touch</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have questions, ideas, or want to collaborate? We'd love to hear from you.
            Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Quick Actions */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    {action.icon}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {action.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card id="contact-form">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-500" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        required
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="membership">Membership</SelectItem>
                          <SelectItem value="collaboration">Collaboration</SelectItem>
                          <SelectItem value="workshop">Workshop Request</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="media">Media & Press</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief subject of your message"
                        required
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry, project idea, or how we can help you..."
                      rows={6}
                      required
                      readOnly
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Multiple ways to reach out to us
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-gray-50 rounded-lg p-2 flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{info.title}</h4>
                        <p className="text-sm font-medium text-blue-600">{info.details}</p>
                        <p className="text-xs text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
                <CardDescription>
                  Stay connected on social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl">{social.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{social.name}</div>
                        <div className="text-xs text-gray-500">{social.followers}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* University Link */}
            <Card>
              <CardHeader>
                <CardTitle>University</CardTitle>
                <CardDescription>
                  Learn more about our institution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-blue-600 mb-2">AITU</div>
                    <div className="text-sm text-gray-600">
                      Assiut International Technological University
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="https://www.facebook.com/egc.tech.assiut">
                      Visit University Website
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">General Inquiries</span>
                    <span className="font-medium">24-48 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membership Applications</span>
                    <span className="font-medium">5-7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collaboration Requests</span>
                    <span className="font-medium">3-5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technical Support</span>
                    <span className="font-medium">1-2 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How can I join AITU Dev?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    You can apply through our Join Us page. Fill out the application form and we'll review
                    your submission within 5-7 business days.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer workshops for beginners?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Yes! We regularly organize workshops for all skill levels, from complete beginners
                    to advanced developers. Check our Events page for upcoming sessions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can external students participate?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Our core membership is limited to AITU students, but we welcome external participants
                    in our public workshops and events.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How can companies collaborate with us?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    We're open to partnerships, internship programs, and project collaborations.
                    Contact us through the form above with "Collaboration" as the category.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
