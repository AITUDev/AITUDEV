"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Image from "next/image";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        if (data.success) {
          setProject(data.data);
          setImagePreview(data.data?.image?.url || null);
        } else {
          console.error('Failed to fetch project:', data.error);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProject();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProject((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      const newTech = techInput.trim();
      setProject((prev: any) => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech]
      }));
      setTechInput('');
    }
  };

  const removeTech = (index: number) => {
    setProject((prev: any) => ({
      ...prev,
      technologies: prev.technologies.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setProject((prev: any) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("id", id as string);
      formData.append("name", project.name || "");
      formData.append("description", project.description || "");
      formData.append("status", project.status || "active");
      formData.append("progress", String(project.progress || 0));
      formData.append("technologies", JSON.stringify(project.technologies || []));
      formData.append("startDate", project.startDate || "");
      formData.append("endDate", project.endDate || "");
      formData.append("githubUrl", project.githubUrl || "");
      formData.append("liveUrl", project.liveUrl || "");
      if (project.image instanceof File) {
        formData.append("image", project.image);
      }

      const res = await fetch("/api/projects", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Project updated successfully!");
        router.push("/dashboard/projects");
      } else {
        alert(data.error || "Failed to update project");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading project...</div>;

  return (
    <Card className="max-w-3xl mx-auto p-4 mt-6">
      <CardHeader>
        <CardTitle>Edit Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={project?.name || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={project?.description || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Progress (%)</Label>
            <Input
              type="number"
              name="progress"
              value={project?.progress || 0}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Technologies</Label>
            <div className="flex flex-wrap gap-2 mb-2 min-h-10 p-2 border rounded-md">
              {project?.technologies?.map((tech: string, index: number) => (
                <Badge key={index} className="flex items-center gap-1 px-3 py-1 text-sm">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                placeholder="Type and press Enter to add"
                className="flex-1 min-w-[150px] p-1 outline-none bg-transparent"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Type a technology and press Enter to add it
            </p>
          </div>
          <div>
            <Label>Github URL</Label>
            <Input name="githubUrl" value={project?.githubUrl || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Live URL</Label>
            <Input name="liveUrl" value={project?.liveUrl || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Image</Label>
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                width={150}
                height={150}
                className="rounded-md mb-2"
              />
            )}
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
