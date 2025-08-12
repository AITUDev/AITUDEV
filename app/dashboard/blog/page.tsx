"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthCheck from "../authCheck";
import { Calendar, Edit2, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { BlogPost, useBlog } from "@/hooks/useBlog";
import { AddBlogForm } from "@/components/add-blog-form";
import Link from "next/link";

export default function BlogPage() {

    const { posts: blogs, loading: blogsLoading, deletePost: deleteBlog } = useBlog()


    const [showAddBlog, setShowAddBlog] = useState(false)


    const handleDeleteBlog = async (id: string) => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            const result = await deleteBlog(id)
            if (!result.success) {
                alert('Failed to delete blog post: ' + result.error)
            }
        }
    }

    return (
        <AuthCheck>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Blog</CardTitle>
                            <CardDescription>Upcoming blog posts</CardDescription>
                        </div>
                        <Button onClick={() => setShowAddBlog(true)} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Blog
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {blogsLoading ? (
                        <div className="text-center py-4">Loading blog posts...</div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No blog posts scheduled. Create your first blog post!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {blogs.slice(0, 5).map((blog: BlogPost) => (
                                <div
                                    key={blog._id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 flex-1">
                                        {blog.images && blog.images.length > 0 && (
                                            <Image
                                                src={blog.images[0].url}
                                                alt={blog.title}
                                                width={80}
                                                height={80}
                                                className="rounded-lg object-cover border border-gray-200 shadow-sm flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{blog.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{blog.excerpt}</p>
                                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                                <Badge variant="secondary">{blog.category}</Badge>
                                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(blog.createdAt).toLocaleDateString()}
                                                </div>
                                                <span className="text-sm text-gray-500">{blog.readTime} read</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 sm:mt-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteBlog(blog._id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Link href={`/dashboard/blog/${blog._id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>

                                </div>

                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>{" "}
            {showAddBlog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Add Blog</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddBlog(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <AddBlogForm onClose={() => setShowAddBlog(false)} />
                        </div>
                    </div>
                </div>
            )}
        </AuthCheck>
    );
}
