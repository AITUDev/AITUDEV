import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import Image from "next/image"

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Ahmed Hassan",
      role: "Team Leader",
      specialty: "Full-Stack Development",
      bio: "Computer Science senior with 3+ years of experience in web development. Passionate about building scalable applications and mentoring fellow students.",
      skills: ["React", "Node.js", "Python", "AWS", "Leadership"],
      image: "/professional-male-student.png",
      github: "ahmedhassan",
      linkedin: "ahmed-hassan-dev",
      email: "ahmed@aitudev.com"
    },
    {
      name: "Fatima Al-Zahra",
      role: "Project Coordinator",
      specialty: "Project Management & UI/UX",
      bio: "Information Systems student with a passion for user experience design and project management. Ensures our projects are delivered on time and meet user needs.",
      skills: ["Figma", "Project Management", "User Research", "Agile", "Design Systems"],
      image: "/placeholder-b34hi.png",
      github: "fatima-alzahra",
      linkedin: "fatima-alzahra-pm",
      email: "fatima@aitudev.com"
    },
    {
      name: "Omar Mahmoud",
      role: "Technical Lead",
      specialty: "AI & Machine Learning",
      bio: "AI Engineering student focused on machine learning and data science. Leads our AI initiatives and helps integrate intelligent features into our projects.",
      skills: ["Python", "TensorFlow", "PyTorch", "Data Science", "MLOps"],
      image: "/male-student-portrait-glasses.png",
      github: "omar-mahmoud",
      linkedin: "omar-mahmoud-ai",
      email: "omar@aitudev.com"
    },
    {
      name: "Nour Abdel-Rahman",
      role: "Frontend Developer",
      specialty: "Frontend Development",
      bio: "Software Engineering student specializing in modern frontend technologies. Creates beautiful and responsive user interfaces for our web applications.",
      skills: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Next.js"],
      image: "/professional-student-hijab.png",
      github: "nour-abdel-rahman",
      linkedin: "nour-abdel-rahman-frontend",
      email: "nour@aitudev.com"
    },
    {
      name: "Youssef Ibrahim",
      role: "Backend Developer",
      specialty: "Backend & DevOps",
      bio: "Computer Science student with expertise in backend development and cloud infrastructure. Ensures our applications are scalable and secure.",
      skills: ["Node.js", "Express", "MongoDB", "Docker", "Kubernetes"],
      image: "/professional-bearded-student.png",
      github: "youssef-ibrahim",
      linkedin: "youssef-ibrahim-backend",
      email: "youssef@aitudev.com"
    },
    {
      name: "Maryam Saleh",
      role: "Mobile Developer",
      specialty: "Mobile App Development",
      bio: "Software Engineering student passionate about mobile development. Creates cross-platform mobile applications using modern frameworks.",
      skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
      image: "/professional-female-student-portrait-smiling.png",
      github: "maryam-saleh",
      linkedin: "maryam-saleh-mobile",
      email: "maryam@aitudev.com"
    },
    {
      name: "Karim Mostafa",
      role: "Data Scientist",
      specialty: "Data Science & Analytics",
      bio: "Statistics and Computer Science double major. Specializes in data analysis, visualization, and extracting insights from complex datasets.",
      skills: ["Python", "R", "SQL", "Tableau", "Machine Learning"],
      image: "/professional-curly-hair-student.png",
      github: "karim-mostafa",
      linkedin: "karim-mostafa-data",
      email: "karim@aitudev.com"
    },
    {
      name: "Aya Farouk",
      role: "UI/UX Designer",
      specialty: "User Experience Design",
      bio: "Digital Media student with a focus on user experience and interface design. Creates intuitive and engaging designs for our applications.",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
      image: "/professional-female-student-portrait.png",
      github: "aya-farouk",
      linkedin: "aya-farouk-design",
      email: "aya@aitudev.com"
    },
    {
      name: "Mohamed Ali",
      role: "Cybersecurity Specialist",
      specialty: "Information Security",
      bio: "Cybersecurity student focused on application security and ethical hacking. Ensures our applications are secure and follows best practices.",
      skills: ["Penetration Testing", "Security Auditing", "Python", "Network Security", "OWASP"],
      image: "/placeholder-93mpm.png",
      github: "mohamed-ali-sec",
      linkedin: "mohamed-ali-security",
      email: "mohamed@aitudev.com"
    }
  ]

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">Meet Our Team</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our diverse team of talented students brings together expertise from various fields 
            to create innovative solutions and foster a collaborative learning environment.
          </p>
        </div>

        {/* Leadership Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.slice(0, 3).map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={150}
                      height={150}
                      className="rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <CardTitle className="text-xl text-slate-900">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-semibold">{member.role}</CardDescription>
                  <Badge variant="outline" className="mx-auto">{member.specialty}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" className="p-2">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Team Members */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Core Team Members</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {teamMembers.slice(3).map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="rounded-full object-cover mx-auto border-3 border-gray-200 shadow-md"
                    />
                  </div>
                  <CardTitle className="text-lg text-slate-900">{member.name}</CardTitle>
                  <CardDescription className="text-orange-600 font-medium">{member.role}</CardDescription>
                  <Badge variant="outline" className="mx-auto text-xs">{member.specialty}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {member.skills.slice(0, 3).map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{member.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" className="p-2">
                      <Github className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <Linkedin className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Stats */}
        <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-16 -mx-4 px-4 rounded-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Team Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">50+</div>
                <div className="text-gray-300">Total Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">15+</div>
                <div className="text-gray-300">Core Team</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">8</div>
                <div className="text-gray-300">Specializations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">3</div>
                <div className="text-gray-300">Years Active</div>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Team CTA */}
        <section className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Want to Join Our Team?</h2>
            <p className="text-gray-600 mb-8">
              We're always looking for passionate students who want to learn, grow, and contribute 
              to exciting tech projects. Join us and be part of something amazing!
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Apply to Join
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
