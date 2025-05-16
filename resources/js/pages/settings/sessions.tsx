import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';

import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface Session {
    id: string;
    ip_address: string;
    is_current_device: boolean;
    browser: string;
    platform: string;
    device: string;
    last_active: string;
}

function getDeviceIcon(device: string) {
    const lower = device.toLowerCase();
    if (lower.includes('iphone') || lower.includes('android') || lower.includes('phone')) {
        return <Smartphone className="h-5 w-5 text-muted-foreground mr-3" />;
    }
    if (lower.includes('ipad') || lower.includes('tablet')) {
        return <Tablet className="h-5 w-5 text-muted-foreground mr-3" />;
    }
    return <Monitor className="h-5 w-5 text-muted-foreground mr-3" />;
}

export default function SessionListPage({ sessions }: { sessions: Session[] }) {

    const endSession = (sessionId: string) => {
        router.delete(route('sessions.destroy', sessionId), {
            preserveScroll: true,
        });
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sessions settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Active Sessions" description="Below is a list of devices logged in with your account." />

                    <div className='space-y-2'>
                        {sessions.map((session) => (
                            <Card key={session.id} className={`py-4 ${session.is_current_device ? 'border border-neutral-200 dark:border-neutral-800' : ''}`}>
                                <CardContent className="ps-6 pe-4 flex justify-between gap-4">
                                    <div className='space-y-1'>
                                        <div className="flex items-center font-semibold">
                                            {getDeviceIcon(session.device)}
                                            {session.browser} – {session.platform}
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            IP: {session.ip_address}
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            Last active: {session.last_active}
                                        </div>
                                    </div>

                                    <div>
                                        {session.is_current_device && <Badge variant="default">This device</Badge>}

                                        {!session.is_current_device && (
                                            <Button
                                                variant="destructive"
                                                size="xs"
                                                onClick={() => endSession(session.id)}
                                            >
                                                End session
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
