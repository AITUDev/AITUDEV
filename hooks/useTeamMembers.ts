import { useState, useEffect } from 'react';

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'away';
  avatar?: {
    url: string;
    publicId: string;
  };
  skills: string[];
  joinDate: string;
  bio?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team-members');
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch team members');
      }
    } catch (err) {
      setError('Failed to fetch team members');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTeamMember = async (formData: FormData) => {
    try {
      const response = await fetch('/api/team-members', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(prev => [data.data, ...prev]);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error creating team member:', err);
      return { success: false, error: 'Failed to create team member' };
    }
  };

  const updateTeamMember = async (id: string, formData: FormData) => {
    try {
      formData.append('id', id);
      const response = await fetch('/api/team-members', {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(prev => prev.map(member => 
          member._id === id ? data.data : member
        ));
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error updating team member:', err);
      return { success: false, error: 'Failed to update team member' };
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const response = await fetch(`/api/team-members?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(prev => prev.filter(member => member._id !== id));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error deleting team member:', err);
      return { success: false, error: 'Failed to delete team member' };
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
};
