import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/helper/helper";
import AppLayout from '@/layouts/app-layout';
import { Membership, User, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailIcon, MapPinIcon, MoveRightIcon, PhoneIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hubungi Kami',
        href: '/contact-us',
    },
];

// interface Props {
// }

export default function ContactUsPage({ user }: { user: User }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            preserveState: true,
            only: [],
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hubungi Kami" />
            <div className="px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-10">
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-4 mb-8">
                        <h6 className="text-4xl sm:text-5xl font-semibold">Hubungi Kami</h6>
                        <p className="text-neutral-300">Ada pertanyaan, masukan, atau sekadar ingin menyapa? Jangan ragu untuk menghubungi kami melalui form di bawah ini. Tim kami akan dengan senang hati membantu Anda secepat mungkin.</p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            type="text"
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name || ''}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Nama Lengkap Anda"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email || ''}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="Alamat email aktif"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Nomor Telepon / Whatsapp</Label>
                        <Input
                            id="phone"
                            type="text"
                            tabIndex={3}
                            autoComplete="phone"
                            value={data.phone || ''}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            placeholder="Nomor Telepon / Whatsapp Anda yang aktif"
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="message">Pesan</Label>
                        <Textarea
                            id="message"
                            tabIndex={4}
                            autoComplete="message"
                            value={data.message || ''}
                            onChange={(e) => setData('message', e.target.value)}
                            disabled={processing}
                            placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                            rows={5}
                        />
                        <InputError message={errors.message} className="mt-2" />
                    </div>

                    <Button type="submit" tabIndex={5} disabled={processing} className="mt-2">{processing ? 'Mengirim...' : 'Kirim Pesan'}</Button>
                </form>

                {/* Section: Contact Info */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 space-y-2">
                    <div className="flex items-center gap-3 text-neutral-300">
                        <MapPinIcon className="h-5 w-5" />
                        <p>Denpasar, Bali</p>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-300">
                        <MailIcon className="h-5 w-5" />
                        <p>ternakincomebusiness@gmail.com</p>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-300">
                        <PhoneIcon className="h-5 w-5" />
                        <p>+62 821-2142-4298 ( Whatsapp )</p>
                    </div>
                    <p className="mt-6 text-neutral-300">Kami biasanya merespons dalam 1x24 jam pada hari kerja.</p>
                </div>
            </div>
        </AppLayout>
    );
}