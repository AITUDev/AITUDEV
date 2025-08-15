"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Calendar, Users, ArrowLeft, Code } from 'lucide-react';
import Image from 'next/image';

interface Project {
    _id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    projectType?: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    createdAt: string;
    updatedAt: string;
    teamMembers?: Array<{ _id: string; name: string; role: string }>;
    image?: { url: string; publicId: string };
    priority: string;
}

// Helper function to create a URL-friendly slug
const createSlug = (name: string) => {
    if (!name) return '';
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();
};

export default function ProjectPage() {
    const params = useParams();
    const idOrSlug = params?.id as string; // This could be ID or name slug
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (!idOrSlug) {
                setError('Project identifier is missing');
                setLoading(false);
                return;
            }

            try {
                // First try to find by ID (for backward compatibility)
                let response = await fetch(`/api/projects/${idOrSlug}`);
                let data = await response.json();

                // If not found by ID, try to find by name slug
                if (!data.success) {
                    // Keep the original slug for the API call
                    response = await fetch(`/api/projects/name/${encodeURIComponent(idOrSlug)}`);
                    data = await response.json();
                    
                    // If still not found, try with spaces instead of hyphens
                    if (!data.success && idOrSlug.includes('-')) {
                        const nameWithSpaces = idOrSlug.replace(/-/g, ' ');
                        response = await fetch(`/api/projects/name/${encodeURIComponent(nameWithSpaces)}`);
                        data = await response.json();
                    }
                }

                if (data.success) {
                    setProject(data.data);
                    // Redirect to the slug-based URL if accessed via ID
                    if (idOrSlug !== data.data._id && !idOrSlug.includes('-')) {
                        const slug = createSlug(data.data.name);
                        router.replace(`/projects/${slug}`);
                        return;
                    }
                    const slug = createSlug(data.data.name);
                    if (slug && slug !== idOrSlug) {
                        router.replace(`/projects/${slug}`, { scroll: false });
                    }
                } else {
                    setError(data.error || 'Project not found');
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to load project data');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [idOrSlug, router]);

    useEffect(() => {
        if (project) {
            document.title = `${project.name} | AITU Dev`;
        } else if (error) {
            document.title = 'Error | AITU Dev';
        } else if (!loading) {
            document.title = 'Project Not Found | AITU Dev';
        }
    }, [project, error, loading]);

    if (loading) return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
    if (error) return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error}</div>;
    if (!project) return <div className="container mx-auto px-4 py-12 text-center">Project not found</div>;

    const statusColors = {
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        paused: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
        default: 'bg-gray-100 text-gray-800'
    };

    const priorityColors = {
        urgent: 'bg-red-100 text-red-800',
        high: 'bg-orange-100 text-orange-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800',
        default: 'bg-gray-100 text-gray-800'
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" onClick={() => router.push('/projects')} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{project.name}</h1>
                        <p className="text-gray-600">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className={statusColors[project.status.toLowerCase() as keyof typeof statusColors] || statusColors.default}>
                                {project.status}
                            </Badge>
                            <Badge className={priorityColors[(project.priority || '').toLowerCase() as keyof typeof priorityColors] || priorityColors.default}>
                                {project.priority || 'N/A'} Priority
                            </Badge>
                            {project.projectType && (
                                <Badge variant="outline">
                                    {project.projectType}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Project Image */}
                    {project.image?.url && (
                        <Card className="overflow-hidden">
                            <div className="relative aspect-video">
                                <Image
                                    src={project.image.url}
                                    alt={project.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </Card>
                    )}

                    {/* Project Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="text-gray-700">{project.description}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, i) => (
                                            <Badge key={i} variant="secondary">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Completion</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                                <div className="text-sm text-gray-500">
                                    Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Members */}
                    {project.teamMembers && project.teamMembers.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {project.teamMembers.map((member) => (
                                        <div key={member._id} className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-sm text-gray-500">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {project.githubUrl && (
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="mr-2 h-4 w-4" />
                                        View on GitHub
                                    </a>
                                </Button>
                            )}
                            {project.liveUrl && (
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Live Demo
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}