import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowRight, Eye, Heart } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  const featuredPost = {
    title: "The Future of AI in Web Development: Trends to Watch in 2024",
    excerpt: "Explore how artificial intelligence is revolutionizing web development, from automated code generation to intelligent user interfaces.",
    content: "As we advance into 2024, artificial intelligence continues to reshape the landscape of web development...",
    author: "Omar Mahmoud",
    date: "2024-02-10",
    readTime: "8 min read",
    category: "Artificial Intelligence",
    image: "/placeholder.svg?height=400&width=800",
    views: 1250,
    likes: 89,
    featured: true
  }

  const blogPosts = [
    {
      title: "Getting Started with React Hooks: A Comprehensive Guide",
      excerpt: "Learn how to use React Hooks to manage state and side effects in functional components effectively.",
      author: "Nour Abdel-Rahman",
      date: "2024-02-08",
      readTime: "6 min read",
      category: "Web Development",
      image: "/placeholder.svg?height=200&width=400",
      views: 890,
      likes: 67
    },
    {
      title: "Mobile App Security: Best Practices for Developers",
      excerpt: "Essential security measures every mobile app developer should implement to protect user data.",
      author: "Mohamed Ali",
      date: "2024-02-05",
      readTime: "10 min read",
      category: "Mobile Development",
      image: "/placeholder.svg?height=200&width=400",
      views: 756,
      likes: 54
    },
    {
      title: "Data Visualization with Python: From Basics to Advanced",
      excerpt: "Master the art of data visualization using Python libraries like Matplotlib, Seaborn, and Plotly.",
      author: "Karim Mostafa",
      date: "2024-02-03",
      readTime: "12 min read",
      category: "Data Science",
      image: "/placeholder.svg?height=200&width=400",
      views: 1120,
      likes: 78
    },
    {
      title: "UI/UX Design Principles Every Developer Should Know",
      excerpt: "Bridge the gap between design and development with these essential UI/UX principles.",
      author: "Aya Farouk",
      date: "2024-01-30",
      readTime: "7 min read",
      category: "Design",
      image: "/placeholder.svg?height=200&width=400",
      views: 945,
      likes: 71
    },
    {
      title: "Building Scalable APIs with Node.js and Express",
      excerpt: "Learn how to create robust and scalable REST APIs using Node.js, Express, and modern best practices.",
      author: "Youssef Ibrahim",
      date: "2024-01-28",
      readTime: "9 min read",
      category: "Backend Development",
      image: "/placeholder.svg?height=200&width=400",
      views: 823,
      likes: 62
    },
    {
      title: "Cross-Platform Mobile Development: Flutter vs React Native",
      excerpt: "A detailed comparison of Flutter and React Native to help you choose the right framework.",
      author: "Maryam Saleh",
      date: "2024-01-25",
      readTime: "11 min read",
      category: "Mobile Development",
      image: "/placeholder.svg?height=200&width=400",
      views: 1340,
      likes: 95
    },
    {
      title: "Machine Learning Model Deployment: From Development to Production",
      excerpt: "Step-by-step guide to deploying machine learning models in production environments.",
      author: "Omar Mahmoud",
      date: "2024-01-22",
      readTime: "13 min read",
      category: "Machine Learning",
      image: "/placeholder.svg?height=200&width=400",
      views: 687,
      likes: 48
    },
    {
      title: "Git Workflow Best Practices for Team Collaboration",
      excerpt: "Improve your team's productivity with these proven Git workflow strategies and conventions.",
      author: "Ahmed Hassan",
      date: "2024-01-20",
      readTime: "5 min read",
      category: "Development Tools",
      image: "/placeholder.svg?height=200&width=400",
      views: 1150,
      likes: 83
    }
  ]

  const categories = [
    { name: "All", count: 25 },
    { name: "Web Development", count: 8 },
    { name: "Mobile Development", count: 5 },
    { name: "Artificial Intelligence", count: 4 },
    { name: "Data Science", count: 3 },
    { name: "Design", count: 2 },
    { name: "Backend Development", count: 2 },
    { name: "Development Tools", count: 1 }
  ]

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">Tech Blog</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Insights, tutorials, and thoughts from our team members on the latest in technology, 
            programming, and innovation.
          </p>
        </div>

        {/* Featured Post */}
        <section className="mb-16">
          <Card className="overflow-hidden border-t-4 border-t-blue-500 hover:shadow-xl transition-shadow">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  width={800}
                  height={400}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-500">Featured</Badge>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <Badge variant="outline">{featuredPost.category}</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-900 hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${featuredPost.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{featuredPost.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{featuredPost.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Latest Posts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="bg-white/90">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-lg mb-3 group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <span className={`text-sm ${index === 0 ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                        {category.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Popular Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).sort((a, b) => b.views - a.views).map((post, index) => (
                    <div key={index} className="flex gap-3">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
                <CardDescription>
                  Subscribe to our newsletter for the latest tech insights and tutorials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
