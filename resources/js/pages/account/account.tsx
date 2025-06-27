import Heading from "@/components/heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { countdownDays, formatDateTime } from "@/helper/helper";
import { useInitials } from "@/hooks/use-initials";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Role, User } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import Accountcreate from "./account-create";
import AccountEdit from "./account-edit";
import AccountDelete from "./account-delete";
import AssignRoleToUser from "./account-role";
import InputSearch from "@/components/filter/input-search";
import { useCallback, useEffect } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
];

interface AccountProps {
    users: User[];
    roles: Role[];
    filters: {
        search?: string;
        role_id?: number;
    }
}

function account({ users, roles, filters }: AccountProps) {

    const getInitials = useInitials();

    const { data, setData, get } = useForm({
        search: filters.search || '',
        role_id: filters.role_id || '',
    });

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            get(route('account.index'), { preserveState: true, replace: true });
        }, 400); // debounce waktu 400ms
        return () => clearTimeout(delayDebounce);
    }, [data.search, data.role_id]);

    // const handleSearch = useCallback((value: string) => {
    //     setData('search', value);
    //     get(route('account.index'), {
    //         preserveState: true,
    //         replace: true,
    //     });
    // }, [data.search]);
    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Akun" />

            <div className="px-4 py-6">
                <Heading title="Manajemen Akun" description="Informasi data akun, mengelola dan mengatur hak akses." />
                <div className="flex justify-between items-center gap-4 mb-4">
                    <Accountcreate />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Select onValueChange={(value) => setData('role_id', Number(value))} value={data.role_id?.toString() || ''}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputSearch
                            value={data.search}
                            onSearch={(value: string) => setData('search', value)}
                            placeholder="Search name or email..."
                            debounceDelay={0}
                        />
                    </div>
                    {/* <input
                        type="text"
                        placeholder="Search user..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="border px-2 py-1"
                    /> */}
                </div>
                <div className="grid grid-cols-1">
                    <ScrollArea>
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
                                    {users.map((user, index) => (
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
                                            <TableCell className="text-center">{user.membership?.name ? user.membership.name : '-'}</TableCell>
                                            <TableCell className="text-center">{user.membership_expires_at ? countdownDays(user.membership_expires_at) : '-'}</TableCell>
                                            <TableCell className="text-center">{user.role?.name ? user.role.name : '-'}</TableCell>
                                            <TableCell className={`text-center ${user.provider === 'none' ? 'text-neutral-500' : ''}`}>{user.provider}</TableCell>
                                            <TableCell className="text-neutral-500">{formatDateTime(user.created_at)}</TableCell>
                                            <TableCell className="text-neutral-500">{user.created_at !== user.updated_at ? formatDateTime(user.updated_at) : '-'}</TableCell>
                                            <TableCell>
                                                <div className="text-center flex items-center justify-center gap-1">
                                                    <AssignRoleToUser user={user} roles={roles} />
                                                    <AccountEdit user={user} />
                                                    <AccountDelete user={user} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                    </ScrollArea>
                </div>
            </div>
        </AppLayout>
    )
}

export default account