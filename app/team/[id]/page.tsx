"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Globe, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    status: string;
    bio: string;
    email: string;
    skills: string[];
    avatar?: {
        url: string;
        publicId: string;
    };
    socialLinks?: {
        github?: string;
        linkedin?: string;
        portfolio?: string;
    };
    joinDate: string;
}

// Helper function to create a URL-friendly slug
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

export default function TeamMemberPage() {
    const params = useParams();
    const id = params?.id as string; // Type assertion since we know this is a dynamic route
    const router = useRouter();
    const [member, setMember] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMember = async () => {
            if (!id) {
                setError('Team member ID is missing');
                setLoading(false);
                return;
            }

            try {
                // First try to find by ID (for backward compatibility)
                let response = await fetch(`/api/team-members/${id}`);
                let data = await response.json();

                // If not found by ID, try to find by name slug
                if (!data.success) {
                    const nameFromSlug = id.replace(/-/g, ' ');
                    response = await fetch(`/api/team-members/name/${nameFromSlug}`);
                    data = await response.json();
                }

                if (data.success) {
                    setMember(data.data);
                    // Redirect to the slug-based URL if accessed via ID
                    if (id.includes('-')) return; // Already using slug
                    const slug = createSlug(data.data.name);
                    if (slug !== id) {
                        router.replace(`/team/${slug}`, { scroll: false });
                    }
                } else {
                    setError(data.error || 'Failed to fetch team member');
                }
            } catch (err) {
                console.error('Error fetching team member:', err);
                setError('Failed to load team member data');
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [id, router]);

    // Set page title when member data is loaded
    useEffect(() => {
        if (member) {
            document.title = `${member.name} | AITU Dev`;
        } else if (error) {
            document.title = 'Error | AITU Dev';
        } else if (!loading) {
            document.title = 'Team Member Not Found | AITU Dev';
        }
    }, [member, error, loading]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">Loading team member...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center text-red-500">{error}</div>
                <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => router.push('/team')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Team
                    </Button>
                </div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">Team member not found</div>
                <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => router.push('/team')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Team
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>

            <Head>
                <title>{member.name}</title>
                <meta name="description" content={`تعرف على ${member.name} ودوره في الفريق`} />
                <meta property="og:title" content={member.name} />
                <meta property="og:description" content={`تعرف على ${member.name} ودوره في الفريق`} />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => router.push('/team')} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Team
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="md:col-span-1">
                        <Card className="h-full">
                            <CardContent className="pt-6 text-center">
                                <div className="mx-auto w-40 h-40 relative rounded-full overflow-hidden border-4 border-gray-100 mb-4">
                                    {member.avatar?.url ? (
                                        <Image
                                            src={member.avatar.url}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-2xl font-bold">{member.name}</h1>
                                <p className="text-gray-600 mb-2">{member.role}</p>

                                <Badge
                                    className={`mb-4 ${member.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : member.status === 'inactive'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}
                                >
                                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                </Badge>

                                <div className="mt-4 space-y-2 text-left">
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="h-4 w-4 mr-2" />
                                        <a href={`mailto:${member.email}`} className="hover:underline">
                                            {member.email}
                                        </a>
                                    </div>

                                    {member.socialLinks?.github && (
                                        <div className="flex items-center text-gray-600">
                                            <Github className="h-4 w-4 mr-2" />
                                            <a
                                                href={member.socialLinks.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                GitHub Profile
                                            </a>
                                        </div>
                                    )}

                                    {member.socialLinks?.linkedin && (
                                        <div className="flex items-center text-gray-600">
                                            <Linkedin className="h-4 w-4 mr-2" />
                                            <a
                                                href={member.socialLinks.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                LinkedIn Profile
                                            </a>
                                        </div>
                                    )}

                                    {member.socialLinks?.portfolio && (
                                        <div className="flex items-center text-gray-600">
                                            <Globe className="h-4 w-4 mr-2" />
                                            <a
                                                href={member.socialLinks.portfolio}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                Portfolio
                                            </a>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <p className="text-sm text-gray-500">Member since {new Date(member.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* About Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {member.bio || 'No bio available.'}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Skills Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills & Expertise</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {member.skills && member.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills.map((skill, index) => (
                                            <Badge key={index} variant="secondary" className="text-sm">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No skills listed.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Projects Section - You can fetch and display member's projects here */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">
                                    {member.name}'s projects will be displayed here.
                                </p>
                                {/* You can map through member's projects here */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
