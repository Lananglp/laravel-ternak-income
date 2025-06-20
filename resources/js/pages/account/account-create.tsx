import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "@inertiajs/react";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";

type AccountForm = {
    name: string;
    email: string;
    isDefaultPassword: boolean;
    password: string | null;
    password_confirmation: string | null;
}

export const Accountcreate = () => {

    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, setError, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<AccountForm>>({
        name: '',
        email: '',
        isDefaultPassword: true,
        password: null,
        password_confirmation: null,
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('account.store'), {
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
                    <Button type="button" variant="outline"><PlusIcon /> Add Account</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Account</DialogTitle>
                        <DialogDescription>
                            Add a new account to the system.
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
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between border border-border rounded-md px-3 py-2">
                                    <div>
                                        <Label htmlFor="default-password">Use Default Password</Label>
                                        {/* <p className="text-sm text-muted-foreground">To view/change the default password please click here.</p> */}
                                        <p className="text-sm text-muted-foreground">To configure the default password, go to settings.</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch tabIndex={3} checked={data.isDefaultPassword} onCheckedChange={(e) => setData('isDefaultPassword', e)} disabled={processing} id="default-password" />
                                    </div>
                                </div>
                            </div>

                            {!data.isDefaultPassword && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="Password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">Confirm password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            tabIndex={5}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            placeholder="Confirm password"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </>
                            )}

                            <Button type="submit" className="mt-2 w-full" tabIndex={6} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Accountcreate;