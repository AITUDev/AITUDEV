import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Service } from "@/hooks/useOurServices";

type Props = {
    services: Service[];
    onEdit: (service: Service) => void;
    onDelete: (id: string) => void;
};

export default function TableOurServices({ services, onEdit, onDelete }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Service</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price per hour</TableHead>
                    <TableHead>Price per project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {services.map((service) => (
                    <TableRow key={service._id}>
                        <TableCell className="font-medium">{service.title}</TableCell>
                        <TableCell>{service.description}</TableCell>
                        <TableCell>{service.price_per_hour}</TableCell>
                        <TableCell>{service.price_per_project}</TableCell>
                        <TableCell>{service.type}</TableCell>
                        <TableCell>{new Date(service.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(service)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => onDelete(service._id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}