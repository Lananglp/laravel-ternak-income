import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "@inertiajs/react";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";

type BenefitForm = {
    benefit: string;
    is_active: boolean;
}

export const BenefitCreate = ({ membership_id }: { membership_id: number }) => {

    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, setError, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<BenefitForm>>({
        benefit: '',
        is_active: true,
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('benefits.store', membership_id), {
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
                    <Button variant={'primary'} size={'xs'} title="Tambah benefit" ><PlusIcon /> Tambah Benefit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Benefit</DialogTitle>
                        <DialogDescription>
                            Buat benefit baru. Pastikan mengisi field yang diperlukan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="grid gap-4">
                            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium text-white">Checklist Benefit</p>
                                    <p className="text-sm text-neutral-500">Aktifkan benefit untuk menandai benefit tersedia untuk membership ini.</p>
                                </div>
                                <div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(value) => setData('is_active', value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="benefit">Benefit</Label>
                                <Input
                                    id="benefit"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="benefit"
                                    onChange={(e) => setData('benefit', e.target.value)}
                                    disabled={processing}
                                    placeholder="Nama benefit"
                                />
                                <InputError message={errors.benefit} className="mt-2" />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Buat Benefit
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BenefitCreate;