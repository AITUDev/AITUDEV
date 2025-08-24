"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight } from "lucide-react"

export interface TeamMember {
  _id: string
  name: string
  role: string
  status: string
  avatar?: { url: string; publicId: string }
  skills: string[]
  bio: string
}

export default function TeamSection({
  teamMembers,
  loading,
}: {
  teamMembers: TeamMember[]
  loading: boolean
}) {
  const featuredMembers = teamMembers.filter((m) => m.status === "active").slice(0, 4)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get to know the talented individuals who make AITU Dev a thriving community of innovation.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-5 bg-gray-200 w-1/2 mx-auto rounded mb-2" />
                <div className="h-4 bg-gray-200 w-2/3 mx-auto rounded" />
              </div>
            ))}
          </div>
        ) : featuredMembers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">No team members available yet.</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredMembers.map((member) => (
              <Card key={member._id} className="text-center group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    {member.avatar?.url ? (
                      <Image
                        src={member.avatar.url}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.bio}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{member.skills.length - 3}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/team">
              Meet Full Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
