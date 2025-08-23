"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import IconPicker from "@/components/IconPicker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthCheck from "../authCheck";

type LucideIcon = React.ComponentType<{ className?: string }>;

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  price_per_hour: string;
  price_per_project: string;
  type:
  | "all"
  | "digital-media"
  | "mobile-app"
  | "programming"
  | "ai-intelligence"
  | "web-design"
  | "web-management"
  | "network";
  createdAt: string;
  updatedAt: string;
}

type ServiceForm = Omit<Service, "_id" | "createdAt" | "updatedAt">;

export default function ServicesDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceForm>({
    title: "",
    description: "",
    icon: "",
    price_per_hour: "",
    price_per_project: "",
    type: "all",
  });

  const { toast } = useToast();

  // === Fetch Services ===
  const fetchServices = async () => {
    try {
      const response = await fetch("/api/our-service", { cache: "no-store" });
      const data = await response.json();
      const arr = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.data)
          ? (data as any).data
          : [];

      const normalized: Service[] = arr.map((doc: any) => ({
        _id: String(doc?._id),
        title: doc?.title ?? "",
        description: doc?.description ?? "",
        icon: doc?.icon ?? "",
        price_per_hour: doc?.price_per_hour ?? "",
        price_per_project: doc?.price_per_project ?? "",
        type: doc?.type ?? "all",
        createdAt: new Date(doc?.createdAt || Date.now()).toISOString(),
        updatedAt: new Date(doc?.updatedAt || Date.now()).toISOString(),
      }));

      setServices(normalized);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // === Handlers ===
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: keyof ServiceForm; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.icon.trim()) {
      toast({
        title: "Icon required",
        description: "Please select an icon for the service.",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingService
        ? `/api/our-service/${editingService._id}`
        : "/api/our-service";
      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save service");

      toast({
        title: "Success",
        description: editingService
          ? "Service updated successfully"
          : "Service added successfully",
      });

      setIsDialogOpen(false);
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        icon: "",
        type: "all",
        price_per_hour: "",
        price_per_project: "",
      });
      fetchServices();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      type: service.type,
      price_per_hour: service.price_per_hour,
      price_per_project: service.price_per_project,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const response = await fetch(`/api/our-service/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      toast({ title: "Success", description: "Service deleted successfully" });
      fetchServices();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  // === Render ===
  return (
    <AuthCheck>

      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">🚀 Our Services</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="rounded-xl"
                onClick={() => {
                  setEditingService(null);
                  setFormData({
                    title: "",
                    description: "",
                    icon: "",
                    type: "all",
                    price_per_hour: "",
                    price_per_project: "",
                  });
                }}
              >
                <Plus className="mr-2 h-5 w-5" /> Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {editingService ? "✏️ Edit Service" : "✨ Add New Service"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Service Title"
                  required
                />
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Service Description"
                  rows={4}
                  required
                />
                <Input
                  name="price_per_hour"
                  value={formData.price_per_hour}
                  onChange={handleInputChange}
                  placeholder="Price per hour"
                  required
                />
                <Input
                  name="price_per_project"
                  value={formData.price_per_project}
                  onChange={handleInputChange}
                  placeholder="Price per project"
                  required
                />
                <div>
                  <Label>Project Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      handleInputChange({ target: { name: "type", value } })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="digital-media">Digital Media</SelectItem>
                      <SelectItem value="mobile-app">Mobile App</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="ai-intelligence">
                        AI Intelligence
                      </SelectItem>
                      <SelectItem value="web-design">Web Design</SelectItem>
                      <SelectItem value="web-management">
                        Web Management
                      </SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Icon Picker */}
                <div>
                  <Label>Icon</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <IconPicker
                        value={formData.icon}
                        onChange={(iconName) =>
                          setFormData((prev) => ({ ...prev, icon: iconName }))
                        }
                      />
                    </div>
                    {formData.icon && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, icon: "" }))
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingService ? "Update" : "Add"} Service
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                ⏳ Loading services...
              </div>
            ) : services.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="mb-4">No services found yet.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add your first service
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => {
                    const Icon = service.icon
                      ? (LucideIcons[
                        service.icon as keyof typeof LucideIcons
                      ] as LucideIcon)
                      : null;
                    return (
                      <TableRow key={service._id} className="hover:bg-gray-50">
                        <TableCell>
                          {Icon ? (
                            <Icon className="h-5 w-5 text-blue-600" />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {service.title}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>{service.description}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {service.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          {new Date(service.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(service)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(service._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>


    </AuthCheck>

  );
}
