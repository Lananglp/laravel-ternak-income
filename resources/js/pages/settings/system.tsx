import { Head, router, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Transition } from '@headlessui/react';
import { FormEventHandler, useState } from 'react';
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'System settings',
        href: '/settings/system',
    },
];

interface SystemPageProps {
    systemConfig: {
        default_user_password: string;
    };
}

type SystemConfigForm = {
    default_user_password: string;
}

export default function SystemPage({ systemConfig }: SystemPageProps) {
    const [showDefaultUserPassword, setShowDefaultUserPassword] = useState(false);

    const { data, setData, put, errors, processing, recentlySuccessful } = useForm<Required<SystemConfigForm>>({
        default_user_password: systemConfig.default_user_password,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('system.update'), {
            preserveScroll: true,
            onSuccess: () => {
                router.get(route('system.edit'), {}, {
                    preserveScroll: true,
                    only: ['systemConfig']
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="System settings" description="Configure your app system settings" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="default_user_password">Default user password</Label>

                            <div className='mt-1 relative'>
                                <Input
                                    id="default_user_password"
                                    className="block w-full"
                                    type={showDefaultUserPassword ? 'text' : 'password'}
                                    value={data.default_user_password}
                                    onChange={(e) => setData('default_user_password', e.target.value)}
                                    required
                                    autoComplete="off"
                                    placeholder="Default user password"
                                />
                                <button onClick={() => setShowDefaultUserPassword(!showDefaultUserPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showDefaultUserPassword ? <PiEyeBold className='w-4 h-4' /> : <PiEyeClosedBold className='w-4 h-4' />}</button>
                            </div>

                            <InputError className="mt-2" message={errors.default_user_password} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
