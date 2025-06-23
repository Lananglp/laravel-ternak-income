import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MembershipBenefit } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { LoaderCircle, PenIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";

export const BenefitEdit = ({ membershipId, benefit }: { membershipId: number, benefit: MembershipBenefit }) => {

    const [open, setOpen] = useState(false);
    const { data, setData, put, errors, setError, clearErrors, reset, processing } = useForm({
        benefit: benefit.benefit || '',
        is_active: benefit.is_active ?? true,
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('benefits.update', [membershipId, benefit.id]), {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
                router.get(route('membership.index'), {}, {
                    preserveScroll: true,
                    only: ['memberships']
                });
            },
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
                    <Button variant={'primary'} size={'iconXs'} title="Edit benefit" className='rounded-full bg-neutral-700 hover:bg-neutral-600'><PenIcon /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Benefit</DialogTitle>
                        <DialogDescription>
                            Edit benefit. Silahkan mengubah field yang diperlukan.
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
                                        disabled={processing}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="benefit">Benefit</Label>
                                <Input
                                    id="benefit"
                                    type="text"
                                    autoFocus
                                    autoComplete="off"
                                    value={data.benefit}
                                    onChange={(e) => setData('benefit', e.target.value)}
                                    disabled={processing}
                                    placeholder="Nama benefit"
                                />
                                <InputError message={errors.benefit} className="mt-2" />
                            </div>
                            <Button type="submit" className="mt-2 w-full" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin me-2" />}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BenefitEdit;
