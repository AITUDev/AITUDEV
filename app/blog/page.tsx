"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowRight, Eye, Heart, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useBlog, BlogPost } from "@/hooks/useBlog"

export default function BlogPage() {
  const { posts, loading, error } = useBlog()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post: BlogPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory && post.published
  })

  // Get featured post (first published post marked as featured)
  const featuredPost = posts.find((post: BlogPost) => post.featured && post.published)

  // Get regular posts (excluding featured)
  const regularPosts = filteredPosts.filter((post: BlogPost) => !post.featured)

  // Get unique categories with counts
  const categories = [
    { name: 'All', count: posts.filter(p => p.published).length },
    ...Array.from(new Set(posts.filter(p => p.published).map(p => p.category)))
      .map(category => ({
        name: category,
        count: posts.filter(p => p.published && p.category === category).length
      }))
  ]

  // Get popular posts (sorted by views)
  const popularPosts = [...posts]
    .filter((post: BlogPost) => post.published)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Error loading blog posts: {error}</p>
          </div>
        </div>
      </div>
    )
  }

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

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16">
            <Card className="overflow-hidden border-t-4 border-t-blue-500 hover:shadow-xl transition-shadow">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  {featuredPost.images && featuredPost.images.length > 0 ? (
                    <div className="relative">
                      <Image
                        src={featuredPost.images[0].url}
                        alt={featuredPost.title}
                        width={800}
                        height={400}
                        className="w-full h-64 lg:h-full object-cover"
                      />
                      {featuredPost.images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          +{featuredPost.images.length - 1} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt={featuredPost.title}
                      width={800}
                      height={400}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-500">Featured</Badge>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <Badge variant="outline">{featuredPost.category}</Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-slate-900 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${featuredPost._id}`}>
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
                      <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={`/blog/${featuredPost._id}`}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
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
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">
              {searchTerm ? `Search Results (${regularPosts.length})` : 'Latest Posts'}
            </h2>

            {regularPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No posts found matching your search.' : 'No blog posts available yet.'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {regularPosts.map((post: BlogPost) => (
                  <Card key={post._id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        {post.images && post.images.length > 0 ? (
                          <div className="relative">
                            <Image
                              src={post.images[0].url}
                              alt={post.title}
                              width={400}
                              height={200}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {post.images.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                +{post.images.length - 1}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Image
                            src="/placeholder.svg"
                            alt={post.title}
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge variant="outline" className="bg-white/90">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="text-lg mb-3 group-hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${post._id}`}>
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
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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
            )}
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
                    <div
                      key={index}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${selectedCategory === category.name ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <span className={`text-sm ${selectedCategory === category.name ? 'font-semibold text-blue-600' : 'text-gray-700'
                        }`}>
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
            {popularPosts.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Popular Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {popularPosts.map((post: BlogPost) => (
                      <div key={post._id} className="flex gap-3">
                        {post.images && post.images.length > 0 ? (
                          <Image
                            src={post.images[0].url}
                            alt={post.title}
                            width={60}
                            height={60}
                            className="w-15 h-15 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <Image
                            src="/placeholder.svg"
                            alt={post.title}
                            width={60}
                            height={60}
                            className="w-15 h-15 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                            <Link href={`/blog/${post._id}`}>
                              {post.title}
                            </Link>
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <Eye className="h-3 w-3" />
                            <span>{post.views} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {posts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(posts.flatMap((post: BlogPost) => post.tags)))
                      .slice(0, 10)
                      .map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
