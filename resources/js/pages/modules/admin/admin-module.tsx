import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Module, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Vibrant } from 'node-vibrant/browser';
import { EyeIcon, GripHorizontal, GripVertical, ImageOffIcon, LockIcon, PenIcon, TrashIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Modulecreate from '../module-create';
import { OutlineSection } from '../module';
// import Modulecreate from './module-create';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Modules',
        href: '/admin/modules',
    },
];

const ModuleSection = ({ title, slug, description, lessons, duration, image, isActive }: { title: string; slug: string; description: string; lessons: number; duration: string; image: string, isActive: boolean }) => {

    const [imgReady, setImgReady] = useState(false);
    const [imgError, setImgError] = useState(false);

    const [bgColor, setBgColor] = useState<string | null>(null);
    const [textColor, setTextColor] = useState<string>('#ffffff');
    const [isColorReady, setIsColorReady] = useState<boolean>(false);

    useEffect(() => {
        Vibrant.from(image)
            .getPalette()
            .then((palette) => {
                if (palette.Vibrant) {
                    setBgColor(palette.Vibrant.hex);
                    setTextColor(palette.Vibrant.titleTextColor);
                    setIsColorReady(true);
                }
            })
            .catch((err) => {
                console.error('Gagal ambil warna dari gambar:', err);
                setBgColor(null);
                setTextColor('#ffffff'); // Default text color if Vibrant fails
                setIsColorReady(true);
            });
    }, [image]);

    if (!isColorReady) {
        return (
            <OutlineSection className='relative p-3 space-y-2'>
                <Skeleton className='rounded-lg aspect-video bg-neutral-900' />
                <div className='p-2 space-y-2'>
                    <div className='space-y-1'>
                        <Skeleton className='inline-block h-5 w-11/12' />
                        <Skeleton className='inline-block h-5 w-2/3' />
                    </div>
                    <div className='space-y-1'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-1/2' />
                    </div>
                    {/* <h3 className='text-lg font-semibold mt-2'>Loading...</h3>
                        <p className='text-sm text-neutral-400'>Mohon tunggu sebentar, mengambil informasi modul.</p> */}
                </div>
                <Skeleton className='h-8 w-full rounded-lg' />
            </OutlineSection>
        );
    }

    return (
        <OutlineSection isActive={isActive} className='relative space-y-3 flex flex-col p-4' bgColor={bgColor}>
            {/* <div className={`bg-gradient-to-bl from-neutral-900/15 to-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 flex flex-col`}> */}
                <div className='h-full grow space-y-3'>
                    <div className='flex justify-between items-center gap-4'>
                        <Button
                            // {...attributes}
                            // {...listeners}
                            variant={'transparent'}
                            size={'iconXs'}
                            title="Geser untuk ubah urutan"
                        >
                            <GripHorizontal className="w-5 h-5 text-neutral-500" />
                        </Button>
                        <div className='space-x-2'>
                            <Button variant={'primary'} size={'xs'} title="Edit membership" ><PenIcon />Edit</Button>
                            {/* <Button title={`Hapus ${membership.name}`} type="button" variant="destructive" size={'iconXs'} className='rounded-full'><TrashIcon /></Button> */}
                            <Button type="button" variant="destructive" size={'iconXs'} ><TrashIcon /></Button>
                        </div>
                    </div>
                    <div className='space-y-3'>
                        <div onClick={() => imgReady && window.open(image)} className='col-span-5 relative hidden md:block aspect-video bg-neutral-800 rounded-lg'>
                            {image && (
                                <>
                                    {imgReady && (
                                        <div className='absolute inset-0 opacity-0 hover:opacity-100 hover:cursor-pointer flex items-center justify-center bg-black/50 rounded-lg transition-opacity duration-200 text-sm text-nowrap'>
                                            <EyeIcon className='size-4 me-1' />Lihat
                                        </div>
                                    )}
                                    {imgError && (
                                        <div className='absolute inset-0 flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 rounded-lg text-sm gap-2'>
                                            <ImageOffIcon className='size-6 me-1' />
                                            Thumbnail tidak tersedia
                                        </div>
                                    )}
                                    <img onError={() => { setImgReady(false); setImgError(true) }} onLoad={() => setImgReady(true)} src={image} alt="" width={400} height={225} className='aspect-video object-cover rounded-lg' />
                                </>
                            )}
                        </div>
                        <div className='col-span-12 md:col-span-7 text-zinc-400 space-y-2'>
                            {/* <div className='text-nowrap text-orange-500 font-semibold'>{lessons} Video</div> */}
                            <div className='text-lg lg:text-xl font-medium text-white'>{title}</div>
                            <div className='text-sm line-clamp-2'>{description}</div>
                        </div>
                    </div>
                </div>
                <div className='flex-auto'>
                    <Button onClick={() => router.visit(`/modules/${slug}`)} disabled={!isActive} variant={'secondary'} size={'sm'} className='w-full'>Kelola Video</Button>
                </div>
            {/* </div> */}
        </OutlineSection>
    );
}

export default function AdminModules({ modules }: { modules: Module[] }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modules" />
            <div className="px-4 py-6">
                <Heading title="Data Modul" description="Manajemen data modul anda" />
                <Modulecreate />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {modules && modules.map((module) => (
                        <ModuleSection
                            title={module.title}
                            slug={module.slug}
                            description={module.description}
                            lessons={module.videos_count}
                            duration="2h 30m"
                            image={`/files/${module.thumbnail}`}
                            isActive={true}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
