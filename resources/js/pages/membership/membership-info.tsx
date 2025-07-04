import Heading from "@/components/heading";
import { countdownDays, formatDate, formatDateTime, formatRupiah } from "@/helper/helper";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Membership, SharedData, User } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { TimerIcon } from "lucide-react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Membership',
        href: '/membership',
    },
];

function daysLeft(date: string): number {
    const expires = new Date(date);
    const now = new Date();
    const diffTime = expires.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // konversi ms ke hari
}

interface MembershipProps {
    member: User;
}

export default function MembershipPage({ member }: MembershipProps) {
    const isActive = member.membership_expires_at && new Date(member.membership_expires_at) > new Date();
    
    const daysRemaining =
        isActive && member.membership_expires_at
            ? daysLeft(member.membership_expires_at)
            : null;

    const showWarning = daysRemaining !== null && daysRemaining <= 7;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Membership Info" />
            <div className="px-4 py-6">
                <Heading title="Informasi Membership" description="berikut adalah informasi dari Membership Anda" />
                {showWarning && (
                    <div className="mb-6 p-4 rounded-xl bg-yellow-300/15 border border-yellow-300/20 text-neutral-300 flex items-center gap-4">
                        <div>
                            <TimerIcon className="size-12" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm">
                                Masa aktif Anda tersisa{' '}
                                <span className="text-white font-medium">{member.membership_expires_at ? countdownDays(member.membership_expires_at) : '0 hari'}</span>.
                            </p>
                            <p className="text-sm">Silahkan melakukan perpanjangan Membership setelah masa aktif Membership saat ini berakhir.</p>
                        </div>
                    </div>
                )}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <div className="bg-gradient-to-r from-neutral-900 to-transparent rounded-3xl">
                        <div className="bg-gradient-to-tl from-neutral-500/10 from-[40%] to-[40%] to-transparent rounded-3xl">
                            <div className="bg-gradient-to-bl from-neutral-500/10 from-[30%] to-[30%] to-transparent rounded-3xl border border-neutral-800 p-6 lg:p-10 space-y-2">
                                <div className="flex justify-between gap-4">
                                    <div>
                                        <p className="mb-2 text-neutral-300 text-xs md:text-base">Membership Aktif :</p>
                                        <h1 className={`mb-4 text-4xl md:text-5xl font-bold text-orange-200`}>
                                            {isActive ? member.membership?.name : 'Free Plan'}
                                        </h1>
                                        <div className='mb-8 text-nowrap text-white text-3xl font-semibold'>{isActive && member.membership?.price && formatRupiah(member.membership?.price)}</div>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-white md:text-xl font-bold">{isActive && member.membership?.duration_days ? `${member.membership.duration_days} Hari` : 'Selamanya'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs md:text-sm text-neutral-300">Aktif Dari :</p>
                                        <p className="text-xs md:text-base text-orange-200">{isActive ? member.membership_started_at ? formatDate(member.membership_started_at) : '-' : '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs md:text-sm text-neutral-300">Aktif Sampai :</p>
                                        <p className="text-xs md:text-base text-orange-200">{isActive ? member.membership_expires_at ? formatDate(member.membership_expires_at) : '-' : '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            <div className="rounded-2xl border border-neutral-800 p-4 space-y-1">
                                <p className="text-sm text-neutral-300">Masa Aktif :</p>
                                <p className="text-lg text-white font-semibold">{isActive ? member.membership_expires_at ? countdownDays(member.membership_expires_at) : '-' : '-'}</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-800 p-4 space-y-1">
                                <p className="text-sm text-neutral-300">Masa Aktif :</p>
                                <p className="text-lg text-white font-semibold">{isActive ? member.membership_expires_at ? countdownDays(member.membership_expires_at) : '-' : '-'}</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-800 p-4 space-y-1">
                                <p className="text-sm text-neutral-300">Masa Aktif :</p>
                                <p className="text-lg text-white font-semibold">{isActive ? member.membership_expires_at ? countdownDays(member.membership_expires_at) : '-' : '-'}</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-800 p-4 space-y-1">
                                <p className="text-sm text-neutral-300">Masa Aktif :</p>
                                <p className="text-lg text-white font-semibold">{isActive ? member.membership_expires_at ? countdownDays(member.membership_expires_at) : '-' : '-'}</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </AppLayout>
    );
}
