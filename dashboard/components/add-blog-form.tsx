"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import { useBlog } from '@/hooks/useBlog'
import Image from 'next/image'

interface AddBlogFormProps {
  onClose: () => void
}

interface ImagePreview {
  file: File
  preview: string
  id: string
}

export function AddBlogForm({ onClose }: AddBlogFormProps) {
  const { createPost } = useBlog()
  const [loading, setLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    featured: false,
    published: true,
  })

  const categories = [
    'Web Development',
    'Mobile Development',
    'Artificial Intelligence',
    'Data Science',
    'Design',
    'Backend Development',
    'Development Tools',
    'Machine Learning',
    'DevOps',
    'Cybersecurity',
    'Full stack'
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const newImage: ImagePreview = {
            file,
            preview: reader.result as string,
            id: Math.random().toString(36).substr(2, 9)
          }
          setImagePreviews(prev => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
    
    // Reset input
    e.target.value = ''
  }

  const removeImage = (imageId: string) => {
    setImagePreviews(prev => prev.filter(img => img.id !== imageId))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitFormData = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value.toString())
      })
      
      // Add tags
      submitFormData.append('tags', JSON.stringify(tags))
      
      // Add images
      imagePreviews.forEach((imagePreview, index) => {
        submitFormData.append(`images`, imagePreview.file)
      })

      const result = await createPost(submitFormData)
      
      if (result.success) {
        onClose()
        // Reset form
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          author: '',
          category: '',
          featured: false,
          published: true,
        })
        setTags([])
        setImagePreviews([])
      } else {
        alert(result.error || 'Failed to create blog post')
      }
    } catch (error) {
      console.error('Error creating blog post:', error)
      alert('Failed to create blog post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Blog Post</CardTitle>
              <CardDescription>Create a new blog post for your website</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Images Upload Section */}
                <div>
                  <Label>Images</Label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload images or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {imagePreviews.map((imagePreview) => (
                          <div key={imagePreview.id} className="relative group">
                            <Image
                              src={imagePreview.preview}
                              alt="Preview"
                              width={150}
                              height={100}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(imagePreview.id)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <Label>Tags</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Post</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Published</Label>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => handleInputChange('published', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={10}
                required
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
