import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Module, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Vibrant } from 'node-vibrant/browser';
import { GripVertical, LockIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
// import Modulecreate from './module-create';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Modules',
        href: '/admin/modules',
    },
];

const OutlineSection = ({ children, className, bgColor, isActive=false }: { children: React.ReactNode; className?: string; bgColor?: string | null, isActive?: boolean }) => {
    return (
        // <div className='group/card bg-gradient-to-br from-orange-500 to-transparent rounded-xl'>
        <div
            className='group/card rounded-xl'
            style={{
                backgroundImage: bgColor ? `linear-gradient(to bottom right, ${bgColor}, transparent)` : undefined,
            }}
        >
            <div className={`h-full border border-neutral-900 bg-neutral-950/75 ${isActive ? 'group-hover/card:bg-neutral-950/60' : ''} rounded-xl transition-colors duration-200 ${className}`}>
                {children}
            </div>
        </div>
    )
}

const ModuleSection = ({ title, slug, description, lessons, duration, image, isActive }: { title: string; slug: string; description: string; lessons: number; duration: string; image: string, isActive: boolean }) => {

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
        <OutlineSection isActive={isActive} className='relative p-3' bgColor={bgColor}>
            {!isActive &&
                <div className='absolute z-10 inset-0 rounded-lg overflow-hidden'>
                    <div className='w-full h-full backdrop-blur-[4px] bg-neutral-950/50 flex justify-center items-center'>
                        <div className='text-center px-8'>
                            <LockIcon className='mb-2 inline-block h-5 w-5' />
                            <p className='font-semibold text-white'>Terkunci</p>
                            <p className='text-sm text-neutral-300'>Dapatkan akses setelah anda menjadi member aktif.</p>
                        </div>
                    </div>
                </div>
            }
            <div className='aspect-video bg-neutral-900 rounded-lg'>
                <img src={image} alt={title} className='rounded-lg aspect-video object-cover' />
            </div>
            <div className='p-2 space-y-2' >
                <h3 className='text-lg font-semibold mt-2'>{title}</h3>
                <p className='text-sm text-neutral-400'>{description}</p>
                <p className="my-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className='mr-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-950 to-orange-950 text-white'>{lessons} Lessons</span> {duration}
                </p>
                <Button onClick={() => router.visit(`/modules/${slug}`)} disabled={!isActive} variant={'secondary'} size={'sm'} className='w-full'>Mulai Sekarang</Button>
            </div>
            {/* <div className='absolute -bottom-4 start-1/2 -translate-x-1/2'>
                <Button variant={'outline'} size={'sm'}>Mulai Sekarang</Button>
            </div> */}
        </OutlineSection>
    );
}

export default function AdminModules({ modules }: { modules: Module[] }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modules" />
            <div className="px-4 py-6">
                <Heading title="Data Modul" description="Manajemen data modul anda" />
                {/* <Modulecreate /> */}
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                    {/* {modules && modules.map((module) => (
                        <ModuleSection
                            title={module.title}
                            slug={module.slug}
                            description={module.description}
                            lessons={module.videos_count}
                            duration="2h 30m"
                            image={module.thumbnail}
                            isActive={true}
                        />
                    ))} */}
                    <div className={`rounded-xl`}>
                        <div className={`bg-neutral-950 rounded-2xl`}>
                            <div className={`bg-gradient-to-l from-orange-500/15 to-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-row items-center gap-1`}>
                                <Button
                                    // {...attributes}
                                    // {...listeners}
                                    variant={'transparent'}
                                    size={'iconXs'}
                                    title="Geser untuk ubah urutan"
                                >
                                    <GripVertical className="w-5 h-5 text-neutral-500" />
                                </Button>
                                <div className='w-full flex items-center gap-4'>
                                    <div className='hidden md:block w-72 lg:w-md aspect-video bg-neutral-800 rounded-lg'>
                                        <img src="/ngasal/modul1.jpeg" alt="" className='aspect-video object-cover rounded-lg' />
                                    </div>
                                    <div className='w-full text-zinc-400 space-y-1'>
                                        <div className='text-nowrap text-orange-500 font-semibold'>19 Video</div>
                                        <div className='text-lg lg:text-xl font-medium text-white'>Modul 1: Belajar react secara dasar</div>
                                        <div className='text-sm line-clamp-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus corrupti voluptatibus, facilis totam iusto ab.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-neutral-900 border-x border-b border-neutral-800 rounded-b-xl mx-3 px-4 py-3 space-y-2'>
                            <div className='flex justify-between items-center gap-2 mb-2 border-b pb-3'>
                                <h6 className='text-sm'>List Video Modul :</h6>
                                <div className='flex items-center space-x-2'>
                                    {/* <MembershipEdit membership={membership} />
                                    <MembershipDelete membership={membership} /> */}
                                </div>
                            </div>
                            {/* <MembershipBenefit membership={membership} role={role} /> */}

                            <ul>
                                <li
                                    // ref={setNodeRef}
                                    // style={style}
                                    // key={benefit.id}
                                    className={`relative group/benefit rounded-lg flex items-center gap-1 p-1 hover:bg-neutral-800`}
                                >
                                    <div className='flex items-center'>
                                        <Button
                                            // {...attributes}
                                            // {...listeners}
                                            variant={'transparent'}
                                            size={'iconSm'}
                                            title="Ubah urutan benefit"
                                        >
                                            <GripVertical className="w-4 h-4 text-neutral-500" />
                                        </Button>
                                        {/* <div
                                            className={`flex justify-center items-center w-4 h-4 shrink-0 rounded-full text-white ${benefit.is_active ? 'bg-blue-700' : 'bg-red-700'
                                                } mx-1`}
                                        >
                                            {benefit.is_active ? <CheckIcon className="shrink-0 w-3 h-3" /> : <XIcon className="shrink-0 w-3 h-3" />}
                                        </div> */}
                                    </div>
                                    <p className='text-sm text-neutral-400'>Pengenalan Dasar React</p>
                                    {/* <div className='hidden group-hover/benefit:flex items-center absolute end-3 top-1/2 -translate-y-1/2 gap-1'>
                                        <BenefitEdit benefit={benefit} membershipId={membershipId} />
                                        <BenefitDelete benefit={benefit} membershipId={membershipId} />
                                    </div> */}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
