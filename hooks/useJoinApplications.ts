import { useState, useEffect } from 'react';

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  studentId: string;
  year: string;
  major: string;
  specialization: string;
  experience: string;
  motivation: string;
  portfolio?: string;
  availability: string;
  agreeTerms: boolean;
  status: string; // 'pending', 'accepted', 'rejected'
  createdAt: string;
  updatedAt?: string;
}

export function useJoinApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/join');
      const data = await response.json();

      if (data.success) {
        setApplications(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch join applications');
      }
    } catch (err) {
      setError('Failed to fetch join applications');
      console.error('Error fetching join applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
}
