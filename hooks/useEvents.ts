import { useState, useEffect } from 'react';
import { TeamMember } from './useTeamMembers';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'meeting' | 'deadline' | 'workshop' | 'presentation' | 'other';
  image?: {
    url: string;
    publicId: string;
  };
  location?: string;
  attendees: TeamMember[];
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (formData: FormData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setEvents(prev => [data.data, ...prev]);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error creating event:', err);
      return { success: false, error: 'Failed to create event' };
    }
  };

  const updateEvent = async (id: string, formData: FormData) => {
    try {
      formData.append('id', id);
      const response = await fetch('/api/events', {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setEvents(prev => prev.map(event => 
          event._id === id ? data.data : event
        ));
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error updating event:', err);
      return { success: false, error: 'Failed to update event' };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setEvents(prev => prev.filter(event => event._id !== id));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      return { success: false, error: 'Failed to delete event' };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
