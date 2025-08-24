import { useState, useEffect } from "react";

export interface Service {
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

interface ServiceForm {
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
}

const useOurServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [ServiceForm, setServiceForm] = useState<ServiceForm>({
        title: "",
        description: "",
        icon: "",
        price_per_hour: "",
        price_per_project: "",
        type: "all",
    });

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/our-service');
            const data = await response.json();

            if (data.success) {
                setServices(data.data);
                setError(null);
            } else {
                setError(data.error || 'Failed to fetch services');
            }
        } catch (err) {
            setError('Failed to fetch services');
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return { services, loading, error, refetch: fetchServices, editingService, setEditingService, ServiceForm, setServiceForm };
};

export default useOurServices;