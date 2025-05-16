import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
            status?: string;
        };
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.status) toast.success(flash.status);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster position="top-center" />
        </AppLayoutTemplate>
    );
};
