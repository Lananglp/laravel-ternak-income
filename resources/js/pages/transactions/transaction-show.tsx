import { Button } from "@/components/ui/button";
import { formatDateTime, formatRupiah } from "@/helper/helper";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Transaction } from "@/types";
import { Head, router } from "@inertiajs/react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Membership',
        href: '/membership',
    },
];

function formatPaymentType(
    type: string | null,
    store?: string,
    bank?: string
): string {
    if (type === 'cstore') {
        if (store === 'indomaret') return 'Indomaret';
        if (store === 'alfamart') return 'Alfamart';
        return 'Convenience Store';
    }

    if (type === 'bank_transfer') {
        return bank ? `Bank ${bank.toUpperCase()}` : 'Transfer Bank';
    }

    const map: Record<string, string> = {
        credit_card: 'Kartu Kredit',
        gopay: 'GoPay',
        qris: 'QRIS',
        shopeepay: 'ShopeePay',
        dana: 'DANA',
    };

    return type ? map[type] || type : '-';
}

import {
    Clock,
    CheckCircle,
    XCircle,
    Ban,
    Timer,
    HelpCircle,
    LucideIcon,
    MoveRightIcon
} from 'lucide-react';

export function formatTransactionStatus(status: string | null): {
    label: string;
    color: string;
    icon: LucideIcon;
} {
    const map: Record<string, { label: string; color: string; icon: LucideIcon }> = {
        pending: {
            label: 'Menunggu Pembayaran',
            color: 'text-yellow-500',
            icon: Clock,
        },
        success: {
            label: 'Pembayaran Berhasil',
            color: 'text-green-500',
            icon: CheckCircle,
        },
        capture: {
            label: 'Pembayaran Berhasil',
            color: 'text-green-500',
            icon: CheckCircle,
        },
        settlement: {
            label: 'Pembayaran Berhasil',
            color: 'text-green-500',
            icon: CheckCircle,
        },
        deny: {
            label: 'Pembayaran Ditolak',
            color: 'text-red-500',
            icon: XCircle,
        },
        cancel: {
            label: 'Pembayaran Dibatalkan',
            color: 'text-red-500',
            icon: Ban,
        },
        expire: {
            label: 'Pembayaran Kedaluwarsa',
            color: 'text-neutral-500',
            icon: Timer,
        },
    };

    return status
        ? map[status] || {
            label: status,
            color: 'text-neutral-500',
            icon: HelpCircle,
        }
        : {
            label: '-',
            color: 'text-neutral-500',
            icon: HelpCircle,
        };
}

function formatFraudStatus(status: string | null): { label: string, color: string } {
    const map: Record<string, { label: string, color: string }> = {
        accept: { label: 'Diterima', color: 'text-green-300' },
        deny: { label: 'Ditolak', color: 'text-red-300' },
        challenge: { label: 'Perlu Tinjauan', color: 'text-yellow-100' },
    };
    return status ? map[status] || { label: status, color: 'text-neutral-300' } : { label: '-', color: 'text-neutral-300' };
}

interface Props {
    transaction: Transaction;
}

export default function TransactionShow({ transaction }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi Pembayaran" />
            <div className="px-4 py-6 space-y-4">
                <div className='grid grid-cols-1 gap-4'>
                    <div className="bg-gradient-to-r from-neutral-900 to-transparent rounded-2xl border border-neutral-800">
                        <div className="bg-gradient-to-tl from-neutral-500/10 from-[30%] to-[30%] to-transparent rounded-2xl">
                            <div className="bg-gradient-to-bl from-neutral-500/10 from-[30%] to-[30%] to-transparent rounded-2xl p-6 lg:p-10 space-y-2">
                                {(() => {
                                    const { label, color, icon: Icon } = formatTransactionStatus(transaction.transaction_status);
                                    return (
                                        <h1 className={`mb-1 sm:mb-2 lg:mb-4 text-xl sm:text-3xl lg:text-5xl font-bold`}>
                                            <Icon className={`${color} inline-block size-10 me-2`} /> {label}
                                        </h1>
                                    );
                                })()}
                                <p className="mb-4 text-neutral-400 text-xs md:text-base">{transaction.order_id}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm text-neutral-300">Tanggal Pembayaran :</p>
                                        <p>{transaction.paid_at !== null ? formatDateTime(transaction.paid_at) : '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-neutral-300">Nama Member :</p>
                                        <p>{transaction.user.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-neutral-300">Membership :</p>
                                        <p>{transaction.membership.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-neutral-300">Harga Membership :</p>
                                        <p className="font-semibold">{formatRupiah(transaction.membership.price)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-neutral-300">Metode Pembayaran :</p>
                                        {(() => {
                                            let response: any = {};

                                            try {
                                                response = typeof transaction.response === 'string' ? JSON.parse(transaction.response) : transaction.response;
                                            } catch (err) {
                                                console.error('Gagal parse response JSON:', err);
                                                response = {};
                                            }

                                            const bankName = response?.va_numbers?.[0]?.bank;
                                            const vaNumber = response?.va_numbers?.[0]?.va_number;

                                            return (
                                                <div>
                                                    <p>{formatPaymentType(transaction.payment_type, response?.store, bankName)}</p>

                                                    {transaction.payment_type === 'cstore' && response?.payment_code && (
                                                        <p className="text-sm text-neutral-300">
                                                            Kode Bayar : {response.payment_code}
                                                        </p>
                                                    )}

                                                    {transaction.payment_type === 'bank_transfer' && vaNumber && (
                                                        <p className="text-sm text-neutral-300">
                                                            VA : {vaNumber}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-neutral-300">Validasi System :</p>
                                        {(() => {
                                            const { label, color } = formatFraudStatus(transaction.fraud_status);
                                            return (
                                                <p className={`font-medium ${color}`}>{label}</p>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button onClick={() => router.visit(route('module.index'))} variant={'ghost'}>Kembali ke halaman modul<MoveRightIcon /></Button>
            </div>
        </AppLayout>
    );
}
