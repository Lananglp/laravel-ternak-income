import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Role } from '@/types';
import { LoaderCircle, UserCogIcon } from 'lucide-react';
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

type AccountRoleForm = {
    role_id: number | null;
};

export const AssignRoleToUser = ({
    user,
    roles,
}: {
    user: User;
    roles: Role[];
}) => {
    const [open, setOpen] = useState(false);
    const { data, setData, put, errors, setError, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<AccountRoleForm>>({
        role_id: user.role?.id || null,
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    };

    const handleAssignRole = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('account.set-role', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
                router.get(route('account.index'), {}, {
                    preserveScroll: true,
                    only: ['accounts']
                });
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!processing) {
                    if (nextOpen) setOpen(true);
                    else handleClose();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button
                    title={`Change Role of ${user.name}`}
                    type="button"
                    variant="outline"
                    size={'iconSm'}
                >
                    <UserCogIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleAssignRole}>
                    <DialogHeader>
                        <DialogTitle>Assign Role</DialogTitle>
                        <DialogDescription>
                            Assign a new role to{' '}
                            <strong className="font-medium text-black dark:text-white">{user.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 mt-4">
                        <div className='grid gap-2'>
                            <Label htmlFor="role_id">Select Role</Label>
                            <Select onValueChange={(value) => setData('role_id', Number(value))} value={data.role_id?.toString() || ''}>
                                <SelectTrigger id='role_id' tabIndex={1} className="w-full">
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
                            <InputError message={errors.role_id} />
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="animate-spin mr-2" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AssignRoleToUser;