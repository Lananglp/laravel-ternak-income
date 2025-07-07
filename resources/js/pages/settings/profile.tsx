import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler, useRef, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { PenLine } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Profil',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    username: string;
    email: string;
    avatar: File | undefined;
    bio: string | null;
    phone: string | null;
    url: string | null;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        username: auth.user.username,
        email: auth.user.email,
        avatar: undefined,
        bio: auth.user.bio || null,
        phone: auth.user.phone || null,
        url: auth.user.url || null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                router.reload({
                    only: ['auth'],
                });
            }
        });
    };

    // Saat ada perubahan pada file avatar
    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Batalkan perubahan avatar
    const handleCancel = () => {
        setData('avatar', undefined);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Profil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informasi Profil" description="Perbarui informasi profil akun dan alamat email Anda." />

                    <form onSubmit={submit} className="space-y-6">
                        {/* <Avatar className="h-32 w-32 overflow-hidden rounded-full">
                            <AvatarImage
                                src={preview || auth.user.avatar}
                                alt={auth.user.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(auth.user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                        /> */}

                        <div className="flex gap-2">
                            {/* <Button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                            >
                                <PenLine />Ubah Avatar
                            </Button> */}

                            {preview && (
                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    variant="destructive"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Nama Lengkap"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>

                            <Input
                                id="username"
                                className="mt-1 block w-full"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Username"
                            />

                            <InputError className="mt-2" message={errors.username} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>

                            <Textarea
                                id="bio"
                                value={data.bio || ""}
                                onChange={(e) => setData('bio', e.target.value)}
                                rows={3}
                                placeholder="Deskripsi singkat tentang diri Anda"
                            />

                            <InputError className="mt-2" message={errors.bio} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Alamat email</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="Alamat email"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Alamat email Anda belum diverifikasi.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Klik di sini untuk mengirim ulang email verifikasi.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        Tautan verifikasi baru telah dikirim ke alamat email Anda.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Nomor HP / Whatsapp</Label>

                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone || ""}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+62**"
                            />

                            <InputError className="mt-2" message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="url">Website URL</Label>

                            <Input
                                id="url"
                                type="url"
                                value={data.url || ""}
                                onChange={(e) => setData('url', e.target.value)}
                                placeholder="https://yourwebsite.com"
                            />

                            <InputError className="mt-2" message={errors.url} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Simpan Perubahan</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Tersimpan</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
