import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";

type RoleForm = {
    name: string;
    slug: string;
}

export const Rolecreate = () => {

    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, setError, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<RoleForm>>({
        name: '',
        slug: '',
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('role.store'), {
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
                    <Button type="button" variant="outline" className="mb-4"><PlusIcon /> Add Role</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Role</DialogTitle>
                        <DialogDescription>
                            Create a new role to manage permissions and access control within the application.
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
                                    onChange={(e) => setData('slug', e.target.value)}
                                    disabled={processing}
                                    placeholder="Role Slug"
                                />
                                <InputError message={errors.slug} className="mt-2" />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={3} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create role
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Rolecreate;