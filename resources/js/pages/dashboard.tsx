import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatRupiah } from "@/helper/helper";
import AppLayout from '@/layouts/app-layout';
import { Membership, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { MoveRightIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    totalTransaction: number,
    todayTransaction: number,
    yesterdayTransaction: number,
    thisWeekTransaction: number,
    lastWeekTransaction: number,
    thisMonthTransaction: number,
    lastMonthTransaction: number,
    memberships: Membership[],
}

export default function Dashboard({
    totalTransaction,
    todayTransaction,
    yesterdayTransaction,
    thisWeekTransaction,
    lastWeekTransaction,
    thisMonthTransaction,
    lastMonthTransaction,
    memberships,
}: Props ) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="px-4 py-6">
                {/* <Heading title="List of modules" description="Start your career with the right guidance." /> */}
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                    <div className={`rounded-xl`}>
                        <div>
                            <div className={`border border-neutral-900 rounded-xl p-4 flex flex-row items-center gap-1`}>
                                <div className='w-full text-zinc-400 space-y-2'>
                                    <div className='text-nowrap text-orange-200'>Total Semua Transaksi</div>
                                    <div className='text-lg lg:text-3xl font-semibold text-white'>{todayTransaction ? formatRupiah(parseInt(totalTransaction.toString())) : 'Rp. 0'}</div>
                                    <div className='text-sm line-clamp-2'>Angka di atas adalah total semua transaksi yang tercatat pada sistem ini, anda dapat melihat detail transaksi pada menu Pembayaran.</div>
                                </div>
                            </div>
                        </div>
                        <div className='border-x border-b border-neutral-900 rounded-b-xl mx-3 px-4 py-3 space-y-2'>
                            <ul className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                                <li className="border border-neutral-900 rounded-lg space-y-1 p-3">
                                    <p className="text-sm text-neutral-400">Total Transaksi Hari Ini</p>
                                    <p className='font-medium'>{todayTransaction ? formatRupiah(parseInt(todayTransaction.toString())) : 'Rp. 0'}</p>
                                </li>
                                <li className="border border-neutral-900 rounded-lg space-y-1 p-3">
                                    <p className="text-sm text-neutral-400">Total Transaksi Kemarin</p>
                                    <p className='font-medium'>{yesterdayTransaction ? formatRupiah(parseInt(yesterdayTransaction.toString())) : 'Rp. 0'}</p>
                                </li>
                                <li className="border border-neutral-900 rounded-lg space-y-1 p-3">
                                    <p className="text-sm text-neutral-400">Total Transaksi Minggu Ini</p>
                                    <p className='font-medium'>{thisWeekTransaction ? formatRupiah(parseInt(thisWeekTransaction.toString())) : 'Rp. 0'}</p>
                                </li>
                                <li className="border border-neutral-900 rounded-lg space-y-1 p-3">
                                    <p className="text-sm text-neutral-400">Total Transaksi Minggu Lalu</p>
                                    <p className='font-medium'>{lastWeekTransaction ? formatRupiah(parseInt(lastWeekTransaction.toString())) : 'Rp. 0'}</p>
                                </li>
                                <li className="border border-neutral-900 rounded-lg space-y-1 p-3">
                                    <p className="text-sm text-neutral-400">Total Transaksi Bulan Ini</p>
                                    <p className='font-medium'>{thisMonthTransaction ? formatRupiah(parseInt(thisMonthTransaction.toString())) : 'Rp. 0'}</p>
                                </li>
                                <li className="border border-neutral-900 rounded-lg space-y-1 p-3">
                                    <p className="text-sm text-neutral-400">Total Transaksi Bulan Lalu</p>
                                    <p className='font-medium'>{lastMonthTransaction ? formatRupiah(parseInt(lastMonthTransaction.toString())) : 'Rp. 0'}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-lg font-semibold">Memberships Plan</p>
                        <div className="space-y-2">
                            {memberships && memberships.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 border border-neutral-900 rounded-xl p-4">
                                    <div className="w-full">
                                        <h6 className="text-lg font-semibold">{item.name}</h6>
                                        <p className="text-sm text-neutral-400">Konfigurasi Membership Pro Plan, Klik tombol di sebelah kanan.</p>
                                    </div>
                                    <div>
                                        <Link href="/membership" className="bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center w-10 h-10 rounded-full"><MoveRightIcon className="h-4 w-4" /></Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            $1,250.00
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <TrendingUpIcon />
                                +12.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month <TrendingUpIcon className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>New Customers</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            1,234
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <TrendingDownIcon />
                                -20%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Down 20% this period <TrendingDownIcon className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Acquisition needs attention
                        </div>
                    </CardFooter>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Active Accounts</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            45,678
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <TrendingUpIcon />
                                +12.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Strong user retention <TrendingUpIcon className="size-4" />
                        </div>
                        <div className="text-muted-foreground">Engagement exceed targets</div>
                    </CardFooter>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Growth Rate</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            4.5%
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <TrendingUpIcon />
                                +4.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Steady performance increase <TrendingUpIcon className="size-4" />
                        </div>
                        <div className="text-muted-foreground">Meets growth projections</div>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
