"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import AuthCheck from "../authCheck";
import { AddTeamMemberForm } from "@/components/add-team-member-form";
import Link from "next/link";


export default function MembersPage() {
    const { teamMembers, loading: teamLoading, deleteTeamMember } = useTeamMembers();
    const [showAddMember, setShowAddMember] = useState(false);

    const handleDeleteMember = (id: string) => {
        deleteTeamMember(id);
    };

    return (
        <AuthCheck>
            <Card className="shadow-lg border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
                            <CardDescription className="text-gray-500">Active team members</CardDescription>
                        </div>
                        <Button
                            onClick={() => setShowAddMember(true)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Member
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {teamLoading ? (
                        <div className="text-center py-6 text-gray-500">Loading team...</div>
                    ) : teamMembers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No team members yet. Add your first member!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {teamMembers.map((member) => (
                                <div
                                    key={member._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                                            <AvatarImage src={member.avatar?.url} alt={member.name} />
                                            <AvatarFallback>
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-800">{member.name}</p>
                                            <p className="text-sm text-gray-500">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 sm:mt-0">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDeleteMember(member._id)}
                                            className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Link href={`/dashboard/members/${member._id}`}>
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
            {showAddMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Add Team Member</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddMember(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <AddTeamMemberForm onClose={() => setShowAddMember(false)} />
                        </div>
                    </div>
                </div>
            )}

        </AuthCheck>
    );
}
