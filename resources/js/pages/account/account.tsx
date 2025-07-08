import Heading from "@/components/heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { countdownDays, formatDateTime } from "@/helper/helper";
import { useInitials } from "@/hooks/use-initials";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Membership, PaginationType, Role, User } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import Accountcreate from "./account-create";
import AccountEdit from "./account-edit";
import AccountDelete from "./account-delete";
import AssignRoleToUser from "./account-role";
import InputSearch from "@/components/filter/input-search";
import { useCallback, useEffect, useRef } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterByRole } from "@/components/filter/filter-by-role";
import { AppPagination } from "@/components/custom/app-pagination";
import FilterDataPerPage from "@/components/filter/data-per-page";
import SetUserToMember from "./account-set-member";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
];

interface AccountProps {
    users: PaginationType<User>;
    roles: Role[];
    memberships: Membership[];
    filters: {
        search?: string;
        role_id?: number;
    }
}

function account({ users, roles, memberships, filters }: AccountProps) {

    const getInitials = useInitials();

    const { data, setData, get } = useForm({
        search: filters.search || '',
        role_id: filters.role_id && filters.role_id.toString() || '',
        pagination: 10,
    });    
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // skip fetch pertama kali
        }

        const delayDebounce = setTimeout(() => {
            get(route('account.index'), { preserveState: true, replace: true });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [data.search, data.role_id, data.pagination]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Akun" />

            <div className="px-4 py-6">
                <Heading title="Manajemen Akun" description="Informasi data akun, mengelola dan mengatur hak akses." />
                <div className="flex justify-between items-center gap-4 mb-4">
                    <Accountcreate />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <FilterDataPerPage value={data.pagination} onValueChange={(value) => setData('pagination', value)} />
                        <FilterByRole roles={roles} value={data.role_id?.toString() || ''} onValueChange={(value) => setData('role_id', value)} />
                        <InputSearch
                            value={data.search}
                            onSearch={(value: string) => setData('search', value)}
                            placeholder="Search name or email..."
                            debounceDelay={0}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1">
                    <ScrollArea className="pb-2">
                        <ScrollBar orientation="horizontal" />
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">No</TableHead>
                                        <TableHead className="w-[100px]">Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead className="text-center">Membership</TableHead>
                                        <TableHead className="text-center">Berakhir pada</TableHead>
                                        <TableHead className="text-center">Role</TableHead>
                                        <TableHead className="text-center">Provider</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Changed At</TableHead>
                                        <TableHead>Options</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data && users.data.length > 0 ? users.data.map((user, index) => {
                                        const now = new Date();
                                        const isAdmin = user.role?.slug === 'admin';
                                        const isMembershipActive = isAdmin || (user.membership_expires_at ? new Date(user.membership_expires_at) > now : false);
                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <p>{user.name}</p>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.username}</TableCell>
                                                <TableCell className="text-center">
                                                    {user.membership_expires_at && new Date(user.membership_expires_at) > new Date()
                                                        ? user.membership?.name ?? '-'
                                                        : '-'}
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    {user.membership_expires_at && new Date(user.membership_expires_at) > new Date()
                                                        ? countdownDays(user.membership_expires_at)
                                                        : '-'}
                                                </TableCell>
                                                <TableCell className="text-center">{user.role?.name ? user.role.name : '-'}</TableCell>
                                                <TableCell className={`text-center ${user.provider === 'none' ? 'text-neutral-500' : ''}`}>{user.provider}</TableCell>
                                                <TableCell className="text-neutral-500">{formatDateTime(user.created_at)}</TableCell>
                                                <TableCell className="text-neutral-500">{user.created_at !== user.updated_at ? formatDateTime(user.updated_at) : '-'}</TableCell>
                                                <TableCell>
                                                    <div className="text-center flex items-center justify-center gap-1">
                                                        {!isAdmin && <SetUserToMember user={user} memberships={memberships} isActive={isMembershipActive} />}
                                                        <AssignRoleToUser user={user} roles={roles} />
                                                        <AccountEdit user={user} />
                                                        <AccountDelete user={user} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                    )}) : (
                                        <TableRow>
                                            <TableCell colSpan={11}>
                                                Data Tidak Ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                    </ScrollArea>
                    {users.data.length > 0 && <AppPagination item={users} query={data} />}
                </div>
            </div>
        </AppLayout>
    )
}

export default account