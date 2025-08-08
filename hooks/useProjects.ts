import { useState, useEffect } from 'react';

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number;
  image?: {
    url: string;
    publicId: string;
  };
  technologies: string[];
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (formData: FormData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setProjects(prev => [data.data, ...prev]);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error creating project:', err);
      return { success: false, error: 'Failed to create project' };
    }
  };

  const updateProject = async (id: string, formData: FormData) => {
    try {
      formData.append('id', id);
      const response = await fetch('/api/projects', {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setProjects(prev => prev.map(project => 
          project._id === id ? data.data : project
        ));
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error updating project:', err);
      return { success: false, error: 'Failed to update project' };
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setProjects(prev => prev.filter(project => project._id !== id));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      return { success: false, error: 'Failed to delete project' };
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};
