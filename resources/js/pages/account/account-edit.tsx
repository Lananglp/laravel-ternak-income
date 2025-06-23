import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { LoaderCircle, PenLineIcon, PlusIcon, UserRoundPenIcon } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";

type AccountForm = {
    name: string;
    email: string;
    resetToDefaultPassword: boolean;
}

export const AccountEdit = ({ user }: { user: User }) => {

    const [open, setOpen] = useState(false);
    const { data, setData, put, errors, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<AccountForm>>({
        name: user.name,
        email: user.email,
        resetToDefaultPassword: false,
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('account.update', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
                router.get(route('account.index'), {}, {
                    preserveScroll: true,
                    only: ['accounts']
                });
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
                    <Button title={`Edit ${user.name}`} type="button" variant="outline" size={'iconSm'}><UserRoundPenIcon /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Account</DialogTitle>
                        <DialogDescription>
                            Edit the account details.
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
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between border border-border rounded-md px-3 py-2">
                                    <div>
                                        <Label htmlFor="default-password">Reset to Default Password</Label>
                                        <p className="text-sm text-muted-foreground">This will reset your password to the default password.</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch tabIndex={3} checked={data.resetToDefaultPassword} onCheckedChange={(e) => setData('resetToDefaultPassword', e)} disabled={processing} id="default-password" />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={4} disabled={processing}>
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

export default AccountEdit;