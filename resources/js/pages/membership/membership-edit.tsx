import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Membership } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { LoaderCircle, PenIcon, PlusIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";

type MembershipForm = {
    name: string;
    price: number;
    duration_days: number | null;
    tagline?: string | null;
}

export const MembershipEdit = ({ membership }: { membership: Membership }) => {

    const [open, setOpen] = useState(false);
    const { data, setData, put, errors, setError, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<MembershipForm>>({
        name: membership.name || '',
        price: membership.price || 0,
        duration_days: membership.duration_days || null,
        tagline: membership.tagline || null,
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('membership.update', membership.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
                router.get(route('membership.index'), {}, {
                    preserveScroll: true,
                    only: ['memberships']
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
                    <Button variant={'primary'} size={'xs'} title="Edit membership" ><PenIcon />Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Membership</DialogTitle>
                        <DialogDescription>
                            Silahkan edit data agar sesuai dengan yang diperlukan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Nama Membership"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price">Harga</Label>
                                <Input
                                    id="price"
                                    type="tel"
                                    tabIndex={2}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onChange={(e) => {
                                        // Hanya izinkan angka
                                        const value = e.target.value.replace(/[^0-9]/g, "");
                                        setData('price', value === "" ? 0 : parseFloat(value));
                                    }}
                                    onKeyDown={(e) => {
                                        // Cegah input selain angka dan kontrol
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    disabled={processing}
                                    placeholder="0"
                                    value={data.price === 0 ? "" : data.price}
                                />
                                <p className="mb-2 text-xs text-neutral-400">Format harga harus berupa angka, contoh: 10000</p>
                                <InputError message={errors.price} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="duration_days">Durasi ( hari )</Label>
                                <Input
                                    id="duration_days"
                                    type="tel"
                                    tabIndex={3}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, "");
                                        setData('duration_days', value === "" ? 0 : parseInt(value));
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    disabled={processing}
                                    placeholder="0"
                                    value={data.duration_days === 0 || data.duration_days == null ? "" : data.duration_days}
                                />
                                <p className="mb-2 text-xs text-neutral-400">Kosongkan jika tanpa durasi (Akses selamanya)</p>
                                <InputError message={errors.duration_days} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tagline">Tagline</Label>
                                <Input
                                    id="tagline"
                                    type="text"
                                    tabIndex={4}
                                    autoComplete="tagline"
                                    value={data.tagline || ''}
                                    onChange={(e) => setData('tagline', e.target.value)}
                                    disabled={processing}
                                    placeholder="Contoh : Paket terbaik untuk pemula"
                                />
                                <InputError message={errors.tagline} className="mt-2" />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MembershipEdit;