import Heading from "@/components/heading";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/helper/helper";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Role, User } from "@/types";
import { Head } from "@inertiajs/react";
import Rolecreate from "./role-create";
import RoleEdit from "./role-edit";
import RoleDelete from "./role-delete";
// import Accountcreate from "./account-create";
// import AccountEdit from "./account-edit";
// import AccountDelete from "./account-delete";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

interface RoleProps {
    roles: Role[];
}

function RolesPage({ roles }: RoleProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Roles" />

            <div className="px-4 py-6">
                <Heading title="Manage Roles" description="Manage your role settings" />
                <Rolecreate />
                <div className="grid grid-cols-1">
                    <ScrollArea>
                        <ScrollBar orientation="horizontal" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">No</TableHead>
                                    <TableHead className="min-w-[100px]">Name</TableHead>
                                    <TableHead className="min-w-[100px]">Slug</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Changed At</TableHead>
                                    <TableHead>Options</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.map((role, index) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell className="text-neutral-400">{role.slug}</TableCell>
                                        <TableCell className="text-neutral-500">{formatDateTime(role.created_at)}</TableCell>
                                        <TableCell className="text-neutral-500">{role.created_at !== role.updated_at ? formatDateTime(role.updated_at) : '-'}</TableCell>
                                        <TableCell>
                                            <div className="text-center flex items-center justify-center gap-1">
                                                <RoleEdit role={role} />
                                                {/* <RoleDelete role={role} /> */}
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

export default RolesPage;