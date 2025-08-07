import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Github, Youtube } from 'lucide-react'
import Image from "next/image"

export default function Footer() {
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Projects", href: "/projects" },
    { name: "Events", href: "/events" },
    { name: "Blog", href: "/blog" },
    { name: "Join Us", href: "/join" }
  ]

  const resources = [
    { name: "Workshops", href: "/events" },
    { name: "Tutorials", href: "/blog" },
    { name: "GitHub", href: "https://github.com/aitudev" },
    { name: "Documentation", href: "/blog" },
    { name: "Community", href: "/contact" },
    { name: "Support", href: "/contact" }
  ]

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com/aitudev", icon: Facebook },
    { name: "Instagram", href: "https://instagram.com/aitudev", icon: Instagram },
    { name: "LinkedIn", href: "https://linkedin.com/company/aitudev", icon: Linkedin },
    { name: "GitHub", href: "https://github.com/aitudev", icon: Github },
    { name: "YouTube", href: "https://youtube.com/@aitudev", icon: Youtube }
  ]

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo.png" alt="AITU Dev" width={50} height={50} />
              <div className="flex flex-col">
                <span className="text-xl font-bold">AITU Dev</span>
                <span className="text-sm text-gray-400">Student Tech Team</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering students at Assiut International Technological University 
              through technology, innovation, and collaborative learning.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    href={resource.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">contact@aitudev.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">+20 88 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">AITU Campus, Assiut</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AITU Dev. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="https://aitu.edu.eg" className="text-gray-400 hover:text-white text-sm transition-colors">
                University Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
