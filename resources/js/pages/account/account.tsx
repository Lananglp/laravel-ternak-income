import Heading from "@/components/heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/helper/helper";
import { useInitials } from "@/hooks/use-initials";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, User } from "@/types";
import { Head } from "@inertiajs/react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
];

interface AccountProps {
    users: User[];
}

function account({ users }: AccountProps) {

    const getInitials = useInitials();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="px-4 py-6">
                <Heading title="Account" description="Manage your account settings" />
                <Button type="button" onClick={() => toast.success('Your account has been updated')}>hai</Button>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">No</TableHead>
                            {/* <TableHead>Username</TableHead> */}
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">Role</TableHead>
                            <TableHead className="text-center">Provider</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Changed At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                {/* <TableCell>{user.username}</TableCell> */}
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.name}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className={`text-center ${user.role === 'USER' ? 'text-neutral-500' : ''}`}>{user.role}</TableCell>
                                <TableCell className={`text-center ${user.provider === 'none' ? 'text-neutral-500' : ''}`}>{user.provider}</TableCell>
                                <TableCell className="text-neutral-500">{formatDateTime(user.created_at)}</TableCell>
                                <TableCell className="text-neutral-500">{user.created_at !== user.updated_at ? formatDateTime(user.updated_at) : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    )
}

export default account