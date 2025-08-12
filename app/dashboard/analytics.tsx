import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlog } from "@/hooks/useBlog";
import { useEvents } from "@/hooks/useEvents";
import { useProjects } from "@/hooks/useProjects";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Calendar, TrendingUp, Users, Code } from "lucide-react";

export default function Analytics() {


    const { projects, loading: projectsLoading, deleteProject } = useProjects()
    const { teamMembers, loading: teamLoading, deleteTeamMember } = useTeamMembers()
    const { events, loading: eventsLoading, deleteEvent } = useEvents()
    const { posts: blogs, loading: blogsLoading, deletePost: deleteBlog } = useBlog()




    // Calculate real statistics from database data
    const activeProjects = projects.filter(p => p.status === 'active').length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const activeMembers = teamMembers.filter(m => m.status === 'active').length
    const upcomingEvents = events.filter(e => !e.isCompleted && new Date(e.date) >= new Date()).length
    const completedEvents = events.filter(e => e.isCompleted).length


    // Calculate average project progress
    const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0)
    const averageProgress = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {activeProjects} active • {completedProjects} completed
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{teamMembers.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {activeMembers} active members
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {upcomingEvents} upcoming • {completedEvents} completed
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Blog</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{blogs.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {blogs.length} posts
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averageProgress}%</div>
                    <p className="text-xs text-muted-foreground">
                        Project completion rate
                    </p>
                </CardContent>
            </Card>
        </div>

    )
}