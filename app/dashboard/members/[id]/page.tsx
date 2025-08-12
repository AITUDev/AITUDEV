"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Save, X } from "lucide-react";
import AuthCheck from "../../authCheck";

export default function MemberDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [member, setMember] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await fetch(`/api/team-members/${id}`);
        const data = await res.json();
        if (data.success) {
          setMember(data.data);
          setImagePreview(data.data?.image?.url || null);
          setCurrentSkills(data.data?.skills || []);
        } else {
          console.error('Failed to fetch member:', data.error);
        }
      } catch (err) {
        console.error('Error fetching member:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMember();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMember((prev: any) => ({ ...prev, [name]: value }));
  };

  // Skills management
  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!currentSkills.includes(newSkill.trim())) {
        setCurrentSkills([...currentSkills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setCurrentSkills(currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setMember((prev: any) => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    const formData = new FormData();
    formData.append('name', member.name || '');
    formData.append('role', member.role || '');
    formData.append('email', member.email || '');
    formData.append('bio', member.bio || '');
    formData.append('status', member.status || 'active');
    
    // Add skills as JSON string
    formData.append('skills', JSON.stringify(currentSkills));
    
    // Add current image data to retain it if not changing
    if (member.image) {
      formData.append('currentImage', JSON.stringify(member.image));
    }
    
    // Add social links if they exist
    if (member.social) {
      Object.entries(member.social).forEach(([key, value]) => {
        if (value) formData.append(`social.${key}`, value as string);
      });
    }

    // Add image file if a new one was selected
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append('image', fileInput.files[0]);
    }

    try {
      formData.append('id', id as string);
      const res = await fetch(`/api/team-members/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMember(data.data);
        setImagePreview(data.data?.image || null);
        setEditing(false);
      } else {
        console.error('Failed to update member:', data.error);
      }
    } catch (err) {
      console.error('Error updating member:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800">Member not found</h2>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <AuthCheck>
      <Card className="max-w-3xl mx-auto p-4 mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Member Details</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={editing ? 'outline' : 'default'}
              onClick={(e) => {
                e.preventDefault();
                if (editing) {
                  // Reset to original data
                  fetch(`/api/team-members/${id}`)
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        setMember(data.data);
                        setImagePreview(data.data?.image || null);
                      }
                    });
                }
                setEditing(!editing);
              }}
            >
              {editing ? <X className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
              {editing ? 'Cancel' : 'Edit'}
            </Button>
            <Button type="submit" form="member-form" disabled={!editing}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form id="member-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage 
                    src={imagePreview || '/placeholder-user.jpg'} 
                    alt={member.name}
                    className="object-cover rounded-full h-32 w-32 border-2 border-gray-200"
                  />
                  <AvatarFallback className="text-2xl">
                    {member.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
                    <Label htmlFor="image" className="cursor-pointer">
                      <Edit2 className="h-5 w-5 text-blue-600" />
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={member.name || ''}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value={member.role || ''}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={member.email || ''}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  {currentSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-2 min-h-10 p-2 border rounded-md bg-gray-50">
                      {currentSkills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          {skill}
                          {editing && (
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mb-2 p-2 border rounded-md bg-gray-50">
                      No skills added yet
                    </div>
                  )}
                  {editing && (
                    <div className="space-y-2">
                      <Input
                        id="skills"
                        placeholder="Type a skill and press Enter"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={addSkill}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">
                        Press Enter to add a skill. Click the 'x' on a skill to remove it.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={member.status || 'active'}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={member.bio || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthCheck>
  );
}