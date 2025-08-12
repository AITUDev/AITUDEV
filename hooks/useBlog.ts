import { useState, useEffect } from 'react';

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  images?: {
    url: string;
    publicId: string;
  }[];
  readTime: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch blog posts');
      }
    } catch (err) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (formData: FormData) => {
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(prev => [data.data, ...prev]);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error || 'Failed to create blog post' };
      }
    } catch (err) {
      console.error('Error creating blog post:', err);
      return { success: false, error: 'Failed to create blog post' };
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(prev => prev.filter(post => post._id !== id));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to delete blog post' };
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      return { success: false, error: 'Failed to delete blog post' };
    }
  };

  const updatePost = async (id: string, formData: FormData) => {
    try {
      const response = await fetch(`/api/blog?id=${id}`, {
        method: 'PUT',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(prev => prev.map(post => post._id === id ? data.data : post));
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error || 'Failed to update blog post' };
      }
    } catch (err) {
      console.error('Error updating blog post:', err);
      return { success: false, error: 'Failed to update blog post' };
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    updatePost,
    refetch: fetchPosts,
  };
}
