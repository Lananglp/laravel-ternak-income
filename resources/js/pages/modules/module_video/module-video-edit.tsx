import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Module, ModuleVideo } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { ImageIcon, LoaderCircle, PenIcon, PlusIcon } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone'

type VideoForm = {
    title: string;
    description: string | null;
    thumbnail: File | null;
};

export const ModuleVideoEdit = ({ slug, videos }: { slug: string, videos: ModuleVideo }) => {
    const [open, setOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const { data, setData, post, errors, setError, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<VideoForm>>({
        title: videos.title || "",
        description: videos.description || "",
        thumbnail: null,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    // const [videoPreview, setVideoPreview] = useState<string | null>(null);
    // const [openDialog, setOpenDialog] = useState(false);

    const thumbs = useDropzone({
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        multiple: false,
        onDrop: (files) => {
            const file = files[0];
            if (file) {
                setData('thumbnail', file);
                setThumbnailPreview(URL.createObjectURL(file));
            }
        },
    });

    const handleOpen = () => {
        setOpen(true);
        setThumbnailPreview(`/private/images/${videos.thumbnail}`);
        // setData({
        //     title: module.title,
        //     description: module.description,
        //     thumbnail: null,
        // });
    };

    const handleClose = () => {
        setOpen(false);
        setThumbnailPreview(null);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("module.video.update", { slug: slug, id: videos.id }), {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
                router.get(route('module.show', { slug: slug }), {}, {
                    preserveScroll: true,
                    only: ['module']
                });
            },
        });
    };

    useEffect(() => {
        if (imgError) {
            setThumbnailPreview(null);
        }
    }, [imgError, open]);

    return (
        <div>
            <Dialog
                open={open}
                onOpenChange={(nextOpen) => {
                    if (!processing) {
                        if (nextOpen) handleOpen();
                        else handleClose();
                    }
                }}
            >
                <DialogTrigger asChild>
                    <Button variant={'primary'} size={'iconXs'} title="Edit video" className="rounded-full"><PenIcon /></Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90dvh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Modul Video</DialogTitle>
                        <DialogDescription>
                            Silahkan mengisi form di bawah ini untuk mengedit modul video.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Thumbnail</Label>
                                <div {...thumbs.getRootProps()} className={`h-48 flex justify-center items-center border border-dashed border-neutral-800 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${!processing ? thumbs.isDragActive ? 'bg-neutral-900 border-blue-500' : 'hover:bg-neutral-900' : ''}`}>
                                    <input {...thumbs.getInputProps()} disabled={processing} />
                                    {thumbnailPreview ? (
                                        <img onError={() => setImgError(true)} src={thumbnailPreview} alt="Preview Thumbnail" className="mx-auto h-48 object-contain rounded" />
                                    ) : (
                                        <div className="space-y-2 text-neutral-500">
                                            <ImageIcon className="mx-auto size-10" />
                                            <p className="text-sm">Seret & lepas thumbnail di sini, <br /> atau klik untuk memilih gambar.</p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-neutral-500">PNG, JPG, JPEG, WEBP, Max: 2 MB, Rasio: 16:9</p>
                                <InputError message={errors.thumbnail} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Judul</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    autoFocus
                                    autoComplete="off"
                                    value={data.title || ''}
                                    onChange={(e) => setData("title", e.target.value)}
                                    disabled={processing}
                                    placeholder="Judul Modul"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description || ''}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    disabled={processing}
                                    placeholder="Deskripsi Modul"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <Button type="submit" className="mt-2 w-full" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ModuleVideoEdit;
