import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role } from "@/types";
import { useForm } from "@inertiajs/react";
import { LoaderCircle, PenIcon, PlusIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";

type RoleForm = {
    name: string;
    slug: string;
}

export const RoleEdit = ({ role }: { role: Role }) => {

    const [open, setOpen] = useState(false);
    const { data, setData, put, errors, setError, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<RoleForm>>({
        name: role.name,
        slug: role.slug,
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('role.update', role.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
            }
        });
    };

    return (
        <div>
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
                    <Button title={`Edit ${role.name}`} type="button" variant="outline" size={'iconSm'}><PenIcon /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>
                            Update the role to manage permissions and access control within the application.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Role Name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    type="text"
                                    tabIndex={2}
                                    autoComplete="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    disabled={processing}
                                    placeholder="Role Slug"
                                />
                                <InputError message={errors.slug} className="mt-2" />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={3} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                 Save Changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RoleEdit;