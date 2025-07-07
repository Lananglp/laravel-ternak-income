import Heading from "@/components/heading";
import { formatDate, formatRupiah } from "@/helper/helper";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, User } from "@/types";
import { Head } from "@inertiajs/react";
import { CircleAlertIcon, CrownIcon, MegaphoneIcon, TimerIcon } from "lucide-react";


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
    const isAdmin = member.role?.slug === 'admin';
    // const isActive = member.membership_expires_at && new Date(member.membership_expires_at) > new Date();
    const isActive = isAdmin || (member.membership_expires_at ? new Date(member.membership_expires_at) > new Date() : false);
    
    const daysRemaining =
        isActive && member.membership_expires_at
            ? daysLeft(member.membership_expires_at)
            : null;

    const showWarning = daysRemaining !== null && daysRemaining <= 7;

    const countdownDays = (dateString: string): string => {
        const now = new Date();
        const target = new Date(dateString);
        // Hitung selisih dalam milidetik
        const diff = target.getTime() - now.getTime();
        // Konversi ke hari
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days > 0) {
            return `Masa aktif anda tersisa ${days} hari lagi`;
        } else if (days === 0) {
            return "Masa aktif anda segera berakhir pada hari ini";
        } else {
            return "Masa aktif anda telah berakhir";
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Membership Info" />
            <div className="px-4 py-6">
                <Heading title="Informasi Membership" description="berikut adalah informasi dari Membership Anda" />
                {isActive && !member.membership && !isAdmin && (
                    <div className="mb-6 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex gap-6">
                        <div className="mt-2">
                            <MegaphoneIcon className="size-8 lg:size-12" />
                        </div>
                        <div className="space-y-1">
                            <p className="mb-2 text-2xl font-semibold text-white">Pemberitahuan Penting Terkait Membership Anda</p>
                            <p>Kami ingin menginformasikan bahwa saat ini sedang dilakukan <span className="text-white font-medium">perubahan</span> pada struktur data membership di sistem kami.</p>
                            <p>Membership Anda yang <span className="text-white font-medium">masih aktif saat ini tidak akan terdampak</span> oleh perubahan tersebut. Anda tetap dapat mengakses seluruh fitur sesuai ketentuan membership yang berlaku, meskipun mungkin muncul informasi seperti <span className="text-white font-medium">"Terjadi Kesalahan"</span> pada tampilan.</p>
                            <p>Silakan pastikan informasi <span className="text-white font-medium">“Aktif Dari”</span> dan <span className="text-white font-medium">“Aktif Sampai”</span> menampilkan tanggal masa aktif membership Anda dengan benar.</p>
                            <p>Terima kasih atas kepercayaan dan dukungan Anda terhadap layanan kami.</p>
                        </div>
                    </div>
                )}
                {!isActive && (
                    <div className="mb-6 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex lg:items-center gap-4">
                        <div className="mt-2 lg:mt-0">
                            <CrownIcon className="size-8 lg:size-12" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-semibold text-white">Membership anda belum aktif</p>
                            <p className="text-sm text-neutral-300">Saat ini Membership anda belum aktif. Silahkan melakukan pembayaran untuk mengaktifkan Membership.</p>
                        </div>
                    </div>
                )}
                {showWarning && (
                    <div className="mb-6 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-4">
                        <div className="mt-2 lg:mt-0">
                            <TimerIcon className="size-8 lg:size-12" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-semibold text-white">{member.membership_expires_at && countdownDays(member.membership_expires_at)}</p>
                            <p className="text-sm text-neutral-300">Silahkan melakukan perpanjangan Membership setelah masa aktif Membership saat ini berakhir.</p>
                        </div>
                    </div>
                )}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    {isAdmin ? (
                        <div className="bg-gradient-to-r from-neutral-900 to-transparent rounded-3xl">
                            <div className="bg-gradient-to-tl from-neutral-500/10 from-[40%] to-[40%] to-transparent rounded-3xl">
                                <div className="bg-gradient-to-bl from-neutral-500/10 from-[30%] to-[30%] to-transparent rounded-3xl border border-neutral-800 p-6 lg:p-10 space-y-2">
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <p className="mb-2 text-neutral-300 text-xs md:text-base">Terdaftar sebagai :</p>
                                            <h1 className={`mb-4 text-4xl md:text-5xl font-bold text-white`}>
                                                Administrator
                                            </h1>
                                            <div className='mb-8 text-nowrap text-white text-3xl font-semibold'>Bebas Biaya</div>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-white md:text-xl font-bold">Permanen</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-xs md:text-sm text-neutral-300">Aktif Dari :</p>
                                            <p className="text-xs md:text-base text-white">Permanen</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs md:text-sm text-neutral-300">Aktif Sampai :</p>
                                            <p className="text-xs md:text-base text-white">Permanen</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-neutral-900 to-transparent rounded-3xl">
                            <div className="bg-gradient-to-tl from-neutral-500/10 from-[40%] to-[40%] to-transparent rounded-3xl">
                                <div className="bg-gradient-to-bl from-neutral-500/10 from-[30%] to-[30%] to-transparent rounded-3xl border border-neutral-800 p-6 lg:p-10 space-y-2">
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <p className="mb-2 text-neutral-300 text-xs md:text-base">Membership Aktif :</p>
                                            <h1 className={`mb-4 text-4xl md:text-5xl font-bold text-white`}>
                                                {isActive ? member.membership?.name ? member.membership.name : 'Terjadi Kesalahan' : 'Free Plan'}
                                            </h1>
                                            <div className='mb-8 text-nowrap text-white text-3xl font-semibold'>{isActive ? member.membership?.price ? formatRupiah(member.membership?.price) : 'Terjadi Kesalahan' : 'Rp. 0'}</div>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-white md:text-xl font-bold">{isActive ? member.membership ? member.membership?.duration_days ? `${member.membership.duration_days} Hari` : 'Selamanya' : 'Terjadi Kesalahan' : 'Tidak Aktif'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-xs md:text-sm text-neutral-300">Aktif Dari :</p>
                                            <p className="text-xs md:text-base text-white">{isActive ? member.membership_started_at ? formatDate(member.membership_started_at) : '- Tidak Aktif' : '- Tidak Aktif'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs md:text-sm text-neutral-300">Aktif Sampai :</p>
                                            <p className="text-xs md:text-base text-white">{isActive ? member.membership_expires_at ? formatDate(member.membership_expires_at) : '- Tidak Aktif' : '- Tidak Aktif'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
