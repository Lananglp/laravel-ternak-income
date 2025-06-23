import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage<SharedData>().props

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.status) toast.success(flash.status);
        if (flash?.error) toast.error(flash.error);

        const snapToken = flash?.snap_token

        if (snapToken) {
            window.snap.pay(snapToken, {
                onSuccess: function (result) {
                    console.log('Pembayaran berhasil:', result);
                    window.location.href = '/membership/success'; // sesuaikan jika perlu
                },
                onPending: function (result) {
                    console.log('Pembayaran tertunda:', result);
                    window.location.href = '/membership/pending'; // bisa juga redirect sesuai status
                },
                onError: function (result) {
                    console.error('Pembayaran gagal:', result);
                    window.location.href = '/membership/failed';
                },
                onClose: function () {
                    console.warn('Popup ditutup tanpa menyelesaikan pembayaran');
                }
            });
        }
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster position="top-center" />
        </AppLayoutTemplate>
    );
};
