import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatFraudStatus, formatPaymentType, formatRupiah, formatTransactionStatus } from "@/helper/helper";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Role, Transaction, User } from "@/types";
import { Head } from "@inertiajs/react";
import { Code2Icon } from "lucide-react";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pembayaran',
        href: '/transactions',
    },
];

interface RoleProps {
    transactions: Transaction[];
}

function RolesPage({ transactions }: RoleProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History Pembayaran" />

            <div className="px-4 py-6">
                <Heading title="History Pembayaran" description="List data history pembayaran" />
                {/* <Rolecreate /> */}
                <div className="grid grid-cols-1">
                    <ScrollArea>
                        <ScrollBar orientation="horizontal" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Member</TableHead>
                                    <TableHead className="text-center">Membership</TableHead>
                                    <TableHead className="text-center">Harga Membership</TableHead>
                                    <TableHead className="text-center">Metode Pembayaran</TableHead>
                                    <TableHead className="text-center">Status Transaksi</TableHead>
                                    <TableHead className="text-center">Validasi Sistem</TableHead>
                                    <TableHead className="text-center">Response</TableHead>
                                    <TableHead className="text-center">Dibayar pada</TableHead>
                                    <TableHead className="text-center">Dibuat pada</TableHead>
                                    <TableHead className="text-center">Diubah pada</TableHead>
                                    {/* <TableHead>Options</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions && transactions.length > 0 ?
                                    transactions.map((t, index) => (
                                        <TableRow key={index} className="text-neutral-300">
                                            <TableCell className="text-neutral-400 text-xs">{t.order_id}</TableCell>
                                            <TableCell>{t.user.name}</TableCell>
                                            <TableCell className="text-center">{t.membership ? t.membership.name : <span className="text-xs text-muted-foreground">Data dihapus</span>}</TableCell>
                                            <TableCell className="text-center">{t.membership ? formatRupiah(t.membership.price) : <span className="text-xs text-muted-foreground">Data dihapus</span>}</TableCell>
                                            {/* <TableCell className="text-center">{t.payment_type ? t.payment_type : '-'}</TableCell>
                                            <TableCell className="text-center">{t.transaction_status ? t.transaction_status : '-'}</TableCell>
                                            <TableCell className="text-center">{t.fraud_status ? t.fraud_status : '-'}</TableCell> */}
                                            <TableCell className="text-center">
                                                {(() => {
                                                    let response: any = {};

                                                    try {
                                                        response = typeof t.response === 'string' ? JSON.parse(t.response) : t.response;
                                                    } catch (err) {
                                                        console.error('Gagal parse response JSON:', err);
                                                        response = {};
                                                    }

                                                    const bankName = response?.va_numbers?.[0]?.bank;
                                                    const vaNumber = response?.va_numbers?.[0]?.va_number;

                                                    return (
                                                        <div>
                                                            <span className="text-sm">
                                                                {formatPaymentType(t.payment_type, response?.store, bankName)}
                                                            </span>

                                                            {t.payment_type === 'cstore' && response?.payment_code && (
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    Kode Bayar: {response.payment_code}
                                                                </div>
                                                            )}

                                                            {t.payment_type === 'bank_transfer' && vaNumber && (
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    VA: {vaNumber}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {(() => {
                                                    const { label, color } = formatTransactionStatus(t.transaction_status);
                                                    return (
                                                        <span className={`text-xs font-medium ${color}`}>
                                                            {label}
                                                        </span>
                                                    );
                                                })()}
                                            </TableCell>

                                            <TableCell className="text-center">
                                                {(() => {
                                                    const { label, color } = formatFraudStatus(t.fraud_status);
                                                    return (
                                                        <span className={`text-xs font-medium ${color}`}>
                                                            {label}
                                                        </span>
                                                    );
                                                })()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <ResponseDialog response={t.response} />
                                            </TableCell>
                                            <TableCell className="text-center text-neutral-500">{t.paid_at !== null ? formatDateTime(t.paid_at) : '-'}</TableCell>
                                            <TableCell className="text-center text-neutral-500">{t.created_at !== null ? formatDateTime(t.created_at) : '-'}</TableCell>
                                            <TableCell className="text-center text-neutral-500">{t.updated_at && t.updated_at !== t.created_at ? formatDateTime(t.updated_at) : '-'}</TableCell>
                                            {/* <TableCell>
                                                <div className="text-center flex items-center justify-center gap-1">
                                                    <RoleEdit role={role} />
                                                    <RoleDelete role={role} />
                                                </div>
                                            </TableCell> */}
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={12} className="text-neutral-500">
                                                Belum ada data pembayaran
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
        </AppLayout>
    )
}

type ResponseDialogProps = {
    response: string | null;
};

const ResponseDialog = ({ response }: ResponseDialogProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Code2Icon className="w-4 h-4 mr-1" />
                    Lihat
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>JSON Response Midtrans</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1">
                    <ScrollArea className="p-2 rounded border">
                        <ScrollBar orientation="horizontal" />
                        <pre className="text-sm whitespace-pre-wrap break-words">
                            {response ? JSON.stringify(JSON.parse(response), null, 2) : "Tidak ada response"}
                        </pre>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RolesPage;