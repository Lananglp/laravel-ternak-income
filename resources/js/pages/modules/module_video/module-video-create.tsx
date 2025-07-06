import Heading from '@/components/heading'
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout'
import { Module, type BreadcrumbItem } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { ImageIcon, LoaderCircle, VideoIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
    module: Module;
}

type VideoForm = {
    title: string;
    description: string | null;
    thumbnail: File | null;
    video: File | null;
    // duration: number;
    // is_preview: boolean;
};

export default function ModuleVideoCreate({ module }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Modules', href: '/modules' },
        { title: module.title, href: `/modules/${module.slug}` },
        { title: 'Tambah Video', href: `/modules/${module.slug}/create` },
    ];

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<VideoForm>({
        title: '',
        description: '',
        thumbnail: null,
        video: null,
        // duration: 0,
        // is_preview: false,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [videoName, setVideoName] = useState<string | null>(null);

    const {
        getRootProps: getThumbProps,
        getInputProps: getThumbInput,
        isDragActive: isThumbDrag
    } = useDropzone({
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        multiple: false,
        onDrop: (files) => {
            const file = files[0];
            if (file) {
                setData('thumbnail', file);
                setThumbnailPreview(URL.createObjectURL(file));
            }
        }
    });

    const {
        getRootProps: getVideoProps,
        getInputProps: getVideoInput,
        isDragActive: isVideoDrag
    } = useDropzone({
        accept: { 'video/mp4': ['.mp4'], 'video/webm': ['.webm'], 'video/quicktime': ['.mov'] },
        multiple: false,
        onDrop: (files) => {
            const file = files[0];
            if (file) {
                setData('video', file);
                setVideoName(file.name);
                setVideoPreview(URL.createObjectURL(file));
            }
        }
    });

    useEffect(() => {
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
        };
    }, [videoPreview]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('module.video.store', module.slug), { // ganti "1" dengan ID module dinamis jika perlu
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setThumbnailPreview(null);
                setVideoName(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Modul Video" />
            <div className="px-4 py-6 space-y-6">
                <Heading title="tambah Modul Video" description="Isi semua data untuk menambahkan video pembelajaran." />
                <form onSubmit={submit}>
                    <div className="max-w-xl mx-auto space-y-4">

                            {/* Video */}
                            <div className="grid gap-2">
                                <Label>File Video</Label>
                                {/* <div {...getVideoProps()} className={`aspect-video flex justify-center items-center border border-dashed border-neutral-800 rounded-lg text-center cursor-pointer transition-all duration-200 ${!processing ? isVideoDrag ? 'bg-neutral-900 border-blue-500' : 'hover:bg-neutral-900' : ''}`}>
                                    <input {...getVideoInput()} disabled={processing} />
                                    {videoPreview ? (
                                        <video
                                            src={videoPreview}
                                            controls
                                            className="rounded-xl"
                                        />
                                    ) : (
                                        <div className="space-y-2 text-neutral-500">
                                            <VideoIcon className="mx-auto size-10" />
                                            <p className="text-sm">Seret & lepas video di sini,<br />atau klik untuk memilih video.</p>
                                        </div>
                                    )}
                                </div> */}
                                {videoPreview ? (
                                    <div className="space-y-3">
                                        <div className='aspect-video'>
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="w-full h-full rounded-xl"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setVideoPreview(null);
                                                setVideoName(null);
                                                setData('video', null);
                                                clearErrors('video');
                                            }}
                                        >
                                            Ganti Video
                                        </Button>
                                    </div>
                                ) : (
                                    <div {...getVideoProps()} className={`aspect-video flex justify-center items-center border border-dashed border-neutral-800 rounded-lg text-center cursor-pointer transition-all duration-200 ${!processing ? isVideoDrag ? 'bg-neutral-900 border-blue-500' : 'hover:bg-neutral-900' : ''}`}>
                                        <input {...getVideoInput()} disabled={processing} />
                                        <div className="space-y-2 text-neutral-500">
                                            <VideoIcon className="mx-auto size-10" />
                                            <p className="text-sm">Seret & lepas video di sini,<br />atau klik untuk memilih video.</p>
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm text-neutral-500">MP4, WEBM, MOV — Maks. 500 MB — Landscape</p>
                                <InputError message={errors.video} className="mt-2" />
                            </div>

                            {/* Thumbnail */}
                            <div className="grid gap-2">
                                <Label>Thumbnail</Label>
                                <div {...getThumbProps()} className={`h-48 flex justify-center items-center border border-dashed border-neutral-800 rounded-lg text-center cursor-pointer transition-all duration-200 ${!processing ? isThumbDrag ? 'bg-neutral-900 border-blue-500' : 'hover:bg-neutral-900' : ''}`}>
                                    <input {...getThumbInput()} disabled={processing} />
                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="space-y-2 text-neutral-500">
                                            <ImageIcon className="mx-auto size-10" />
                                            <p className="text-sm">Seret & lepas thumbnail di sini,<br />atau klik untuk memilih gambar.</p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-neutral-500">PNG, JPG, JPEG, WEBP — Maks. 2 MB — Rasio 16:9</p>
                                <InputError message={errors.thumbnail} className="mt-2" />
                            </div>

                        {/* Judul */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                type="text"
                                autoComplete="off"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                disabled={processing}
                                placeholder='Judul video'
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* Deskripsi */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={data.description ?? ''}
                                onChange={(e) => setData('description', e.target.value)}
                                disabled={processing}
                                rows={6}
                                placeholder='Deskripsi video'
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        <div>
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Simpan Video
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
