import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DialogHeader } from "@/components/ui/dialog";
import { Service } from "@/hooks/useOurServices";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import IconPicker from "@/components/IconPicker";

// Define local form type based on Service structure
type ServiceForm = Omit<Service, "_id" | "createdAt" | "updatedAt">;

export default function DialogContentService({
    editingService,
    formData,
    setFormData,
    setIsDialogOpen,
    handleInputChange,
    handleSubmit,
}: {
    editingService: Service | null;
    formData: ServiceForm;
    setFormData: React.Dispatch<React.SetStateAction<ServiceForm>>;
    setIsDialogOpen: (open: boolean) => void;
    handleInputChange: (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | { target: { name: keyof ServiceForm; value: string } }
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
}) {
    return (
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
    );
}