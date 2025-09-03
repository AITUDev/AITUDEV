"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus } from 'lucide-react'
import { useTeamMembers } from '@/hooks/useTeamMembers'

interface AddTeamMemberFormProps {
  onClose: () => void
}

export function AddTeamMemberForm({ onClose }: AddTeamMemberFormProps) {
  const { createTeamMember } = useTeamMembers()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active' as 'active' | 'inactive' | 'away',
    bio: '',
  })
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    twitter: '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
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
      submitData.append('email', formData.email)
      submitData.append('role', formData.role)
      submitData.append('status', formData.status)
      submitData.append('bio', formData.bio)
      submitData.append('skills', JSON.stringify(skills))
      submitData.append('socialLinks', JSON.stringify(socialLinks))
      
      if (avatar) {
        submitData.append('avatar', avatar)
      }

      const result = await createTeamMember(submitData)
      
      if (result.success) {
        onClose()
      } else {
        alert(result.error || 'Failed to create team member')
      }
    } catch (error) {
      console.error('Error creating team member:', error)
      alert('Failed to create team member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name.trim()}
          onChange={(e) => handleInputChange('name', e.target.value.trim())}
          placeholder="Enter full name"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email.trim()}
          onChange={(e) => handleInputChange('email', e.target.value.trim())}
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={formData.role.trim()}
            onChange={(e) => handleInputChange('role', e.target.value.trim())}
            placeholder="e.g. Frontend Developer"
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="away">Away</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio.trim()}
          onChange={(e) => handleInputChange('bio', e.target.value.trim())}
          placeholder="Brief bio or description"
        />
      </div>

      <div>
        <Label htmlFor="skills">Skills</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" onClick={addSkill} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Social Links</Label>
        <div className="space-y-2 mt-2">
          <Input
            placeholder="GitHub URL"
            value={socialLinks.github.trim()}
            onChange={(e) => handleSocialLinkChange('github', e.target.value.trim())}
          />
          <Input
            placeholder="LinkedIn URL"
            value={socialLinks.linkedin.trim()}
            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value.trim())}
          />
          <Input
            placeholder="Twitter URL"
            value={socialLinks.twitter.trim()}
            onChange={(e) => handleSocialLinkChange('twitter', e.target.value.trim())}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="avatar">Avatar</Label>
        <div className="mt-2">
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('avatar')?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {avatar ? 'Change Avatar' : 'Upload Avatar'}
          </Button>
          {avatarPreview && (
            <div className="mt-2 flex justify-center">
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-20 h-20 object-cover rounded-full"
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
          {loading ? 'Adding...' : 'Add Member'}
        </Button>
      </div>
    </form>
  )
}
