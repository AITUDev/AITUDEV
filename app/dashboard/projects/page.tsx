"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, GitBranch, Globe, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import AuthCheck from "../authCheck";
import { Progress } from "@/components/ui/progress"; // عدلته لاستخدام progress من ui
import { useProjects } from "@/hooks/useProjects";
import { Badge } from "@/components/ui/badge"; // عدلت الـ Badge للاستفادة من الـ UI
import { AddProjectForm } from "@/components/add-project-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProjectsPage() {
    const router = useRouter();
    const { projects, loading: projectsLoading, deleteProject, updateProject } = useProjects();
    const [showAddProject, setShowAddProject] = useState(false);

    const handleDeleteProject = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            await deleteProject(id);
        }
    };

    const handleUpdateProject = async (id: string, project: any) => {
        if (confirm("Are you sure you want to update this project?")) {
            await updateProject(id, project);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800 border-l-4 border-green-500";
            case "completed": return "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
            case "paused": return "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500";
            case "cancelled": return "bg-red-100 text-red-800 border-l-4 border-red-500";
            default: return "bg-gray-100 text-gray-800 border-l-4 border-gray-400";
        }
    };

    return (
        <AuthCheck>
            <Card className="shadow-lg border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold">Projects</CardTitle>
                            <CardDescription className="text-gray-500">Manage your development projects</CardDescription>
                        </div>
                        <Button
                            onClick={() => setShowAddProject(true)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Project
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {projectsLoading ? (
                        <div className="text-center py-6 text-gray-500">Loading projects...</div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No projects yet. Create your first project!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div
                                    key={project._id}
                                    className={`flex items-center justify-between p-4 rounded-lg shadow-sm hover:shadow-md transition ${getStatusStyles(project.status)}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                                        {project.image?.url && (
                                            <Image
                                                src={project.image.url}
                                                alt={project.name}
                                                width={200}
                                                height={200}
                                                className="rounded-lg object-cover border border-gray-200 shadow-sm flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{project.name}</h3>
                                            <p className="text-sm text-gray-600 break-words max-w-4xl">
                                                {project.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                                <Badge variant="secondary" className="capitalize">
                                                    {project.status}
                                                </Badge>
                                                <div className="flex items-center space-x-1">
                                                    <Progress value={project.progress} className="w-24" />
                                                    <span className="text-xs text-gray-500">{project.progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="flex items-center gap-2 mt-3 sm:mt-0">

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDeleteProject(project._id)}
                                            className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            key={project._id}
                                            onClick={() => router.push(`/dashboard/projects/${project._id}`)}
                                        >
                                            Edit
                                        </Button>

                                    </div>
                                </div>

                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            {
                showAddProject && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-semibold">Add New Project</h2>
                                <Button variant="ghost" size="sm" onClick={() => setShowAddProject(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-6">
                                <AddProjectForm onClose={() => setShowAddProject(false)} />
                            </div>
                        </div>
                    </div>
                )
            }
        </AuthCheck >
    );
}
