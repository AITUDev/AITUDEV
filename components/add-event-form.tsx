"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Upload, CalendarPlus } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { DialogHeader } from './ui/dialog'

interface AddEventFormProps {
  onClose: () => void
}

export default function AddEventForm({ onClose }: AddEventFormProps) {
  const [open, setOpen] = useState(true)
  const { createEvent } = useEvents()
  const { teamMembers } = useTeamMembers()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    type: 'other' as 'meeting' | 'deadline' | 'workshop' | 'presentation' | 'other',
    location: '',
  })
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAttendeeToggle = (memberId: string) => {
    setSelectedAttendees(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
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
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('date', formData.date)
      submitData.append('priority', formData.priority)
      submitData.append('type', formData.type)
      submitData.append('location', formData.location)
      submitData.append('attendees', JSON.stringify(selectedAttendees))
      
      if (image) {
        submitData.append('image', image)
      }

      const result = await createEvent(submitData)
      
      if (result.success) {
        onClose()
      } else {
        alert(result.error || 'Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus className="w-4 h-4 mr-2" />
          إضافة حدث
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة حدث جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title.trim()}
              onChange={(e) => handleInputChange('title', e.target.value.trim())}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description.trim()}
              onChange={(e) => handleInputChange('description', e.target.value.trim())}
              placeholder="Enter event description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={today}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location.trim()}
                onChange={(e) => handleInputChange('location', e.target.value.trim())}
                placeholder="Event location"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Attendees</Label>
            <div className="mt-2 max-h-32 overflow-y-auto space-y-2">
              {teamMembers.map((member) => (
                <div key={member._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`attendee-${member._id}`}
                    checked={selectedAttendees.includes(member._id)}
                    onCheckedChange={() => handleAttendeeToggle(member._id)}
                  />
                  <Label htmlFor={`attendee-${member._id}`} className="text-sm">
                    {member.name} - {member.role}
                  </Label>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <p className="text-sm text-gray-500">No team members available</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="image">Event Image</Label>
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
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
