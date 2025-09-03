"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'

interface AddProjectFormProps {
  onClose: () => void
}

export function AddProjectForm({ onClose }: AddProjectFormProps) {
  const { createProject } = useProjects()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'completed' | 'paused' | 'cancelled',
    projectType: 'all' as 'all' | 'web' | 'mobile' | 'desktop' | 'network' | 'design' | 'software' | 'video game' | 'video' | 'other' | 'hardware',
    progress: 0,
    githubUrl: '',
    liveUrl: '',
  })
  const [technologies, setTechnologies] = useState<string[]>([])
  const [newTechnology, setNewTechnology] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies(prev => [...prev, newTechnology.trim()])
      setNewTechnology('')
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(prev => prev.filter(t => t !== tech))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('status', formData.status)
      submitData.append('projectType', formData.projectType)
      submitData.append('progress', formData.progress.toString())
      submitData.append('technologies', JSON.stringify(technologies))
      submitData.append('githubUrl', formData.githubUrl)
      submitData.append('liveUrl', formData.liveUrl)

      if (image) {
        submitData.append('image', image)
      }

      const result = await createProject(submitData)

      if (result.success) {
        onClose()
      } else {
        alert(result.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={formData.name.trim()}
          onChange={(e) => handleInputChange('name', e.target.value.trim())}
          placeholder="Enter project name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description.trim()}
          onChange={(e) => handleInputChange('description', e.target.value.trim())}
          placeholder="Enter project description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="projectType">Project Type</Label>
          <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="video game">Video Game</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="technologies">Technologies</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTechnology}
            onChange={(e) => setNewTechnology(e.target.value)}
            placeholder="Add technology"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
          />
          <Button type="button" onClick={addTechnology} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="flex items-center gap-1">
              {tech}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeTechnology(tech)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            type="url"
            value={formData.githubUrl.trim()}
            onChange={(e) => handleInputChange('githubUrl', e.target.value.trim())}
            placeholder="https://github.com/..."
          />
        </div>

        <div>
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            type="url"
            value={formData.liveUrl.trim()}
            onChange={(e) => handleInputChange('liveUrl', e.target.value.trim())}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Project Image</Label>
        <div className="mt-2">
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image')?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {image ? 'Change Image' : 'Upload Image'}
          </Button>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
