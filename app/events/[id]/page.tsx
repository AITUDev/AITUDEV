"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  status: string;
  image?: { url: string; publicId: string };
  registrationLink?: string;
  attendees?: Array<{ _id: string; name: string }>;
}

export default function EventPage() {
  const params = useParams();
  const id = params?.id as string; // Type assertion since we know this is a dynamic route
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError('Event ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/events/${id}`);
        const data = await response.json();
        if (data.success) {
          setEvent(data.data);
        } else {
          setError(data.error || 'Failed to fetch event');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Set page title when event data is loaded
  useEffect(() => {
    if (event) {
      document.title = `${event.title} | AITU Dev`;
    } else if (error) {
      document.title = 'Error | AITU Dev';
    } else if (!loading) {
      document.title = 'Event Not Found | AITU Dev';
    }
  }, [event, error, loading]);

  if (loading) return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error}</div>;
  if (!event) return <div className="container mx-auto px-4 py-12 text-center">Event not found</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push('/events')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge className="capitalize">{event.status}</Badge>
              <Badge variant="outline" className="capitalize">{event.type}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {event.image?.url && (
            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={event.image.url}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Date & Time</h3>
                  <p className="text-gray-600">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>

              {event.registrationLink && (
                <div className="pt-2">
                  <Button asChild className="w-full md:w-auto">
                    <a 
                      href={event.registrationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Register Now
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Join us for this exciting {event.type.toLowerCase()}. 
                {event.attendees && event.attendees.length > 0 && (
                  <span className="block mt-2">
                    <Users className="inline-block h-4 w-4 mr-1" />
                    {event.attendees.length} people attending
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          {event.attendees && event.attendees.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.attendees.slice(0, 10).map((attendee) => (
                    <div key={attendee._id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {attendee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{attendee.name}</p>
                      </div>
                    </div>
                  ))}
                  {event.attendees.length > 10 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{event.attendees.length - 10} more attendees
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}