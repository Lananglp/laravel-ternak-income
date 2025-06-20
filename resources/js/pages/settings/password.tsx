import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password({ is_password_empty }: { is_password_empty?: boolean }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Update password" description="Ensure your account is using a long, random password to stay secure" />

                    <form onSubmit={updatePassword} className="space-y-6">

                        {/* <div className='mt-1 relative'>
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
                        </div> */}

                        {!is_password_empty && 
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">Current password</Label>

                                <div className='mt-1 relative'>
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        className="block w-full"
                                        autoComplete="current-password"
                                        placeholder="Current password"
                                    />

                                    <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showCurrentPassword ? <PiEyeBold className='w-4 h-4' /> : <PiEyeClosedBold className='w-4 h-4' />}</button>
                                </div>

                                <InputError message={errors.current_password} />
                            </div>
                        }

                        <div className="grid gap-2 relative">
                            <Label htmlFor="password">New password</Label>

                            <div className='mt-1 relative'>
                                <Input
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    className="block w-full"
                                    autoComplete="new-password"
                                    placeholder="New password"
                                />

                                <button onClick={() => setShowPassword(!showPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showPassword ? <PiEyeBold className='w-4 h-4' /> : <PiEyeClosedBold className='w-4 h-4' />}</button>
                            </div>

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2 relative">
                            <Label htmlFor="password_confirmation">Confirm password</Label>

                            <div className='mt-1 relative'>
                                <Input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    className="block w-full"
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                />

                                <button onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showPasswordConfirmation ? <PiEyeBold className='w-4 h-4' /> : <PiEyeClosedBold className='w-4 h-4' />}</button>
                            </div>

                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save password</Button>

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
