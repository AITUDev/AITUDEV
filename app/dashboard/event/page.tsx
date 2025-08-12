"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthCheck from "../authCheck";
import { Button } from "@/components/ui/button";
import { Badge, Calendar, MapPin, Trash2, X, Plus, Edit2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import AddEventForm from "@/components/add-event-form";
import Link from "next/link";


export default function EventPage() {
    const { events, loading: eventsLoading, deleteEvent } = useEvents();
    const [showAddEvent, setShowAddEvent] = useState(false);

    const handleDeleteEvent = async (id: string) => {
        if (confirm("Are you sure you want to delete this event?")) {
            await deleteEvent(id);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "high": return "bg-red-100 text-red-800";
            case "medium": return "bg-yellow-100 text-yellow-800";
            case "low": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <AuthCheck>
            <Card className="shadow-lg border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold">Events</CardTitle>
                            <CardDescription className="text-gray-500">Upcoming events and deadlines</CardDescription>
                        </div>
                        <Button
                            onClick={() => setShowAddEvent(true)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Event
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {eventsLoading ? (
                        <div className="text-center py-6 text-gray-500">Loading events...</div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No events scheduled. Create your first event!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {events.slice(0, 5).map((event) => (
                                <div
                                    key={event._id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border border-gray-200 hover:shadow-md transition"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                                        {event.image?.url && (
                                            <Image
                                                src={event.image.url}
                                                alt={event.title}
                                                width={70}
                                                height={70}
                                                className="rounded-lg object-cover border border-gray-200 shadow-sm flex-shrink-0"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{event.title}</h3>
                                            <p className="text-sm text-gray-600 break-words">
                                                {event.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                                <Badge className={`${getPriorityColor(event.priority)} capitalize`}>
                                                    {event.priority}
                                                </Badge>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {new Date(event.date).toLocaleDateString()}
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {event.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 sm:mt-0">

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDeleteEvent(event._id)}
                                            className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Link href={`/dashboard/event/${event._id}`}>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {showAddEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Add New Event</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddEvent(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <AddEventForm onClose={() => setShowAddEvent(false)} />
                        </div>
                    </div>
                </div>
            )}
        </AuthCheck>
    );
}
