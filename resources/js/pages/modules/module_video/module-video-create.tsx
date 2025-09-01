import { useState, useEffect, FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon, VideoIcon, LoaderCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Module, type BreadcrumbItem } from '@/types';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type Props = { module: Module; };

type VideoForm = {
    title: string;
    description: string | null;
    thumbnail: File | null;
    video: File | null;
    duration: number;
};

export default function ModuleVideoCreate({ module }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Modules', href: '/modules' },
        { title: module.title, href: `/modules/${module.slug}` },
        { title: 'Tambah Video', href: `/modules/${module.slug}/create` },
    ];

    const { data, setData, post, processing, errors, reset, progress } = useForm<VideoForm>({
        title: '',
        description: '',
        thumbnail: null,
        video: null,
        duration: 0,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

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

    const videos = useDropzone({
        accept: { 'video/mp4': ['.mp4'], 'video/webm': ['.webm'], 'video/quicktime': ['.mov'] },
        multiple: false,
        onDrop: (files) => {
            const file = files[0];
            if (!file) return;

            const videoEl = document.createElement('video');
            videoEl.preload = 'metadata';
            videoEl.src = URL.createObjectURL(file);
            videoEl.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoEl.src);
                setData('duration', Math.floor(videoEl.duration));
            };

            setData('video', file);
            setVideoPreview(URL.createObjectURL(file));
        },
    });

    useEffect(() => {
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
        };
    }, [videoPreview, thumbnailPreview]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setOpenDialog(true);

        post(route('module.video.store', module.slug), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setVideoPreview(null);
                setThumbnailPreview(null);
            },
            onFinish: () => {
                setOpenDialog(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Modul Video" />
            <div className="px-4 py-6 space-y-6">
                <Heading title="Tambah Modul Video" description="Isi semua data untuk menambahkan video pembelajaran." />
                <form onSubmit={submit}>
                    <div className="max-w-xl mx-auto space-y-4">
                        {/* Video */}
                        <div className="grid gap-2">
                            <Label>File Video</Label>
                            {videoPreview ? (
                                <div className="space-y-3">
                                    <div className="aspect-video">
                                        <video src={videoPreview} controls className="w-full h-full rounded-xl" />
                                    </div>
                                    <p className="text-sm text-neutral-400">
                                        Durasi: {Math.floor(data.duration / 60)}m {data.duration % 60}s
                                    </p>
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setData('video', null);
                                        setData('duration', 0);
                                        setVideoPreview(null);
                                    }}>
                                        Ganti Video
                                    </Button>
                                </div>
                            ) : (
                                <div {...videos.getRootProps()} className={`aspect-video flex justify-center items-center border border-dashed rounded-lg cursor-pointer ${!processing ? videos.isDragActive ? 'bg-neutral-900 border-blue-500' : 'hover:bg-neutral-900' : 'opacity-50 cursor-not-allowed'}`}>
                                    <input {...videos.getInputProps()} disabled={processing} />
                                    <div className="text-neutral-500 text-center">
                                        <VideoIcon className="mx-auto size-10" />
                                        <p className="text-sm">Seret & lepas video di sini, atau klik untuk memilih video.</p>
                                    </div>
                                </div>
                            )}
                            <p className="text-sm text-neutral-500">MP4, WEBM, MOV — Maks. 500 MB — Landscape</p>
                            <InputError message={errors.video} className="mt-2" />
                        </div>

                        {/* Thumbnail */}
                        <div className="grid gap-2">
                            <Label>Thumbnail</Label>
                            <div {...thumbs.getRootProps()} className={`h-48 flex justify-center items-center border border-dashed rounded-lg cursor-pointer ${!processing ? thumbs.isDragActive ? 'bg-neutral-900 border-blue-500' : 'hover:bg-neutral-900' : 'opacity-50 cursor-not-allowed'}`}>
                                <input {...thumbs.getInputProps()} disabled={processing} />
                                {thumbnailPreview ? (
                                    <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-neutral-500 text-center">
                                        <ImageIcon className="mx-auto size-10" />
                                        <p className="text-sm">Seret & lepas thumbnail di sini, atau klik untuk memilih gambar.</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-neutral-500">PNG, JPG, JPEG, WEBP — Maks. 2 MB — Rasio 16:9</p>
                            <InputError message={errors.thumbnail} className="mt-2" />
                        </div>

                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                disabled={processing}
                                placeholder="Judul video"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={data.description ?? ''}
                                onChange={e => setData('description', e.target.value)}
                                disabled={processing}
                                rows={6}
                                placeholder="Deskripsi video"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Simpan Video
                        </Button>
                    </div>
                </form>
            </div>

            {/* Progress Dialog */}
            <AlertDialog open={openDialog} onOpenChange={() => { }}>
                <AlertDialogContent onEscapeKeyDown={e => e.preventDefault()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Memproses Upload Video</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p className="text-sm text-neutral-400 mb-4">
                        Sedang mengunggah video, mohon tunggu dan tetap di halaman ini. Pastikan jaringan Anda stabil.
                    </p>
                    {progress && (
                        <>
                            <Progress value={progress.percentage} className="w-full mb-2" />
                            <p className="text-center text-sm">{progress.percentage}%</p>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
