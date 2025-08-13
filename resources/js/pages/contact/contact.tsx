import { AppPagination } from "@/components/custom/app-pagination";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/helper/helper";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Contact, PaginationType, Role } from "@/types";
import { Head, router } from "@inertiajs/react";
import { MailIcon } from "lucide-react";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Pengguna',
        href: '/contact',
    },
];

interface ContactProps {
    contacts: PaginationType<Contact>;
}

function ContactPage({ contacts }: ContactProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pengguna" />

            <div className="px-4 py-6">
                <Heading title="Laporan Pengguna" description="Berikut merupakan data laporan pengguna." />
                <div className="grid grid-cols-1">
                    <ScrollArea>
                        <ScrollBar orientation="horizontal" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">No</TableHead>
                                    <TableHead className="min-w-[100px]">Nama</TableHead>
                                    <TableHead className="min-w-[100px]">Email</TableHead>
                                    <TableHead className="min-w-[100px]">No HP</TableHead>
                                    <TableHead>Pesan</TableHead>
                                    <TableHead>Tanggal & Waktu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.data && contacts.data.length > 0 ? contacts.data.map((c, index) => (
                                    <TableRow key={c.id} className={`relative ${c.is_read ? '' : 'bg-neutral-900'}`}>
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell className="text-neutral-400">{c.email}</TableCell>
                                        <TableCell className="text-neutral-400">{c.phone}</TableCell>
                                        <TableCell className="text-neutral-400"><MessageDialog contactId={c.id} isRead={c.is_read} name={c.name} message={c.message} /></TableCell>
                                        <TableCell className="text-neutral-500">{formatDateTime(c.created_at)}</TableCell>
                                        {!c.is_read && <div className="absolute top-1/2 -translate-y-1/2 start-3 h-2 w-2 bg-red-500 rounded-full animate-pulse" />}
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            Tidak ada data laporan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    {contacts.data.length > 0 && <AppPagination item={contacts} />}
                </div>
            </div>
        </AppLayout>
    )
}

type MessageDialogProps = {
    name: string;
    message: string;
    contactId: number;
    isRead: boolean;
};

const MessageDialog = ({ name, message, contactId, isRead }: MessageDialogProps) => {
    const [open, setOpen] = useState(false);
    const [alreadyMarked, setAlreadyMarked] = useState(isRead);

    const handleOpenChange = (newState: boolean) => {
        // Jika sedang ditutup dan belum pernah dibaca, tandai sebagai dibaca
        if (!newState && !alreadyMarked) {
            router.patch(route('contact.read', contactId), {}, {
                preserveScroll: true,
                preserveState: true,
                only: ['contacts'], // hanya refresh bagian props contacts
                onSuccess: () => {
                    setAlreadyMarked(true);
                    router.reload({ only: ['unreadContactsCount'] });
                },
            });
        }

        setOpen(newState);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" variant={alreadyMarked ? 'outline' : 'primary'} className={`${isRead ? '' : ' animate-pulse'}`}>
                    <MailIcon className="w-4 h-4 mr-1" />
                    {alreadyMarked ? 'Dibaca' : 'Lihat'}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Pesan Dari {name}</DialogTitle>
                </DialogHeader>
                <div className="text-neutral-300 whitespace-pre-wrap">{message}</div>
            </DialogContent>
        </Dialog>
    );
};

export default ContactPage;