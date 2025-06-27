import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";

type ModuleForm = {
    title: string;
    description: string;
    thumbnail: string;
}

export const Modulecreate = () => {

    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, setError, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<ModuleForm>>({
        title: '',
        description: '',
        thumbnail: '',
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('module.store'), {
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
                    <Button type="button" variant="outline" className="mb-4"><PlusIcon /> tambah Modul</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Buat modul baru</DialogTitle>
                        <DialogDescription>
                            Silahkan mengisi form dibawah ini untuk menambahkan modul.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Judul</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="title"
                                    onChange={(e) => setData('title', e.target.value)}
                                    disabled={processing}
                                    placeholder="Judul Modul"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    tabIndex={2}
                                    autoComplete="description"
                                    onChange={(e) => setData('description', e.target.value)}
                                    disabled={processing}
                                    placeholder="Deskripsi Modul"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <Input
                                    id="thumbnail"
                                    type="text"
                                    tabIndex={3}
                                    onChange={(e) => setData('thumbnail', e.target.value)}
                                    disabled={processing}
                                    placeholder="Masukkan URL gambar"
                                />
                                <InputError message={errors.thumbnail} className="mt-2" />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Buat Modul
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Modulecreate;