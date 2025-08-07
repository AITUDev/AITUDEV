import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock, Award, ExternalLink } from 'lucide-react'
import Image from "next/image"

export default function EventsPage() {
  const upcomingEvents = [
    {
      title: "React Workshop: Building Modern Web Apps",
      description: "Learn the fundamentals of React and build your first modern web application with hooks and state management.",
      date: "2024-02-15",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab A, Building 3",
      type: "Workshop",
      capacity: 30,
      registered: 25,
      instructor: "Ahmed Hassan",
      image: "/placeholder.svg?height=200&width=400",
      status: "Open"
    },
    {
      title: "AI & Machine Learning Seminar",
      description: "Explore the latest trends in artificial intelligence and machine learning with industry experts.",
      date: "2024-02-20",
      time: "10:00 AM - 12:00 PM",
      location: "Main Auditorium",
      type: "Seminar",
      capacity: 100,
      registered: 78,
      instructor: "Omar Mahmoud",
      image: "/placeholder.svg?height=200&width=400",
      status: "Open"
    },
    {
      title: "Mobile App Development Bootcamp",
      description: "3-day intensive bootcamp covering React Native and Flutter for cross-platform mobile development.",
      date: "2024-02-25",
      time: "9:00 AM - 4:00 PM",
      location: "Innovation Hub",
      type: "Bootcamp",
      capacity: 20,
      registered: 18,
      instructor: "Maryam Saleh",
      image: "/placeholder.svg?height=200&width=400",
      status: "Almost Full"
    }
  ]

  const pastEvents = [
    {
      title: "Hackathon 2024: Smart Campus Solutions",
      description: "48-hour hackathon focused on developing innovative solutions for campus life improvement.",
      date: "2024-01-15",
      time: "48 hours",
      location: "Innovation Center",
      type: "Competition",
      participants: 120,
      teams: 24,
      winners: ["Team Alpha", "Team Beta", "Team Gamma"],
      image: "/placeholder.svg?height=200&width=400",
      certificates: 120,
      prizes: "Cash prizes and internship opportunities"
    },
    {
      title: "Web Development Fundamentals",
      description: "Comprehensive workshop covering HTML, CSS, JavaScript, and modern web development practices.",
      date: "2024-01-08",
      time: "4 hours",
      location: "Computer Lab B",
      type: "Workshop",
      participants: 35,
      instructor: "Nour Abdel-Rahman",
      image: "/placeholder.svg?height=200&width=400",
      certificates: 35,
      feedback: 4.8
    },
    {
      title: "Cybersecurity Awareness Session",
      description: "Learn about common security threats and best practices for protecting digital assets.",
      date: "2023-12-10",
      time: "2 hours",
      location: "Lecture Hall 1",
      type: "Seminar",
      participants: 85,
      instructor: "Mohamed Ali",
      image: "/placeholder.svg?height=200&width=400",
      certificates: 85,
      feedback: 4.6
    },
    {
      title: "Git & GitHub Workshop",
      description: "Master version control with Git and collaborative development using GitHub.",
      date: "2023-11-25",
      time: "3 hours",
      location: "Computer Lab A",
      type: "Workshop",
      participants: 40,
      instructor: "Youssef Ibrahim",
      image: "/placeholder.svg?height=200&width=400",
      certificates: 40,
      feedback: 4.9
    },
    {
      title: "UI/UX Design Principles",
      description: "Introduction to user interface and user experience design principles and tools.",
      date: "2023-11-18",
      time: "4 hours",
      location: "Design Studio",
      type: "Workshop",
      participants: 28,
      instructor: "Aya Farouk",
      image: "/placeholder.svg?height=200&width=400",
      certificates: 28,
      feedback: 4.7
    },
    {
      title: "Data Science with Python",
      description: "Hands-on workshop covering data analysis, visualization, and machine learning with Python.",
      date: "2023-10-20",
      time: "6 hours",
      location: "Data Lab",
      type: "Workshop",
      participants: 32,
      instructor: "Karim Mostafa",
      image: "/placeholder.svg?height=200&width=400",
      certificates: 32,
      feedback: 4.8
    }
  ]

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">Events & Workshops</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Join our workshops, seminars, and competitions to enhance your skills, network with peers, 
            and stay updated with the latest technology trends.
          </p>
        </div>

        {/* Event Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Events Organized</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">1200+</div>
              <div className="text-gray-600">Participants</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">25+</div>
              <div className="text-gray-600">Workshops</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">Competitions</div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Upcoming Events</h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-green-500">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant={event.status === 'Open' ? 'default' : 'secondary'}
                        className={event.status === 'Open' ? 'bg-green-500' : 'bg-orange-500'}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="bg-white/90">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {event.description}
                  </CardDescription>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>{event.registered}/{event.capacity} registered</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Registration Progress</span>
                      <span>{Math.round((event.registered / event.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Instructor:</span> {event.instructor}
                  </div>

                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Register Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Past Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Past Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {pastEvents.map((event, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-gray-500 text-white">
                        Completed
                      </Badge>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge variant="outline" className="bg-white/90">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-3 text-sm leading-relaxed">
                    {event.description}
                  </CardDescription>
                  
                  <div className="space-y-2 mb-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-blue-500" />
                      <span>{event.participants} participants</span>
                    </div>
                    {event.certificates && (
                      <div className="flex items-center gap-2">
                        <Award className="h-3 w-3 text-blue-500" />
                        <span>{event.certificates} certificates issued</span>
                      </div>
                    )}
                  </div>

                  {event.feedback && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor(event.feedback) ? 'bg-yellow-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                          <span className="text-gray-600 ml-1">{event.feedback}/5</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {event.winners && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-1">Winners:</div>
                      <div className="flex flex-wrap gap-1">
                        {event.winners.map((winner, winnerIndex) => (
                          <Badge key={winnerIndex} variant="secondary" className="text-xs">
                            {winner}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.instructor && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Instructor:</span> {event.instructor}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Event Categories */}
        <section className="mb-16 bg-gray-50 py-16 -mx-4 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Event Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-600">Workshops</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Hands-on learning sessions covering various technologies and programming languages.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-green-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-600">Competitions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Hackathons, coding contests, and innovation challenges with exciting prizes.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-orange-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-orange-600">Seminars</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Expert talks on industry trends, career guidance, and emerging technologies.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-purple-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-purple-600">Bootcamps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Intensive multi-day programs for deep learning and skill development.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 -mx-4 px-4 rounded-lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Our Events</h2>
            <p className="text-blue-100 mb-8">
              Don't miss out on our upcoming workshops, seminars, and competitions. 
              Subscribe to our newsletter to get notified about new events and opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Subscribe to Newsletter
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800">
                View Event Calendar
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
