import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Module, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Vibrant } from 'node-vibrant/browser';
import { CheckIcon, ClapperboardIcon, ClockIcon, CrownIcon, EyeIcon, FilmIcon, GripHorizontal, ImageOffIcon, LockIcon, PenIcon, PlayIcon, TrashIcon, VideoIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ModuleEdit from './module-edit';
import Modulecreate from './module-create';
import ModuleDelete from './module-delete';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDuration, formatDurationText } from '@/helper/helper';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modules',
        href: '/modules',
    },
];

const OutlineSection = ({ children, className, isActive=false }: { children: React.ReactNode; className?: string; bgColor?: string | null, isActive?: boolean }) => {
    return (
        <div className='group/card rounded-2xl h-full bg-gradient-to-tr from-neutral-900 to-transparent'>
            <div className='h-full rounded-2xl bg-gradient-to-tl from-neutral-800/30 to-transparent from-[30%] to-[30%]'>
                <div className='h-full rounded-2xl bg-gradient-to-bl from-neutral-800/30 to-transparent from-[40%] to-[40%]'>
                    <div className={`h-full border border-neutral-800 rounded-2xl transition-colors duration-200 ${className}`}>
                        {children}
                        {!isActive &&
                            <Link href='/membership' className='absolute inset-0 backdrop-blur-[3px] bg-neutral-900/40 hover:bg-neutral-800/50 flex justify-center items-center transition-colors duration-200'>
                                <div className='text-center px-4 space-y-1'>
                                    <LockIcon className='inline-block size-6' />
                                    <p className='text-white font-semibold'>Terkunci</p>
                                    <p className='text-sm text-neutral-300'>Dapatkan akses setelah anda menjadi member aktif.</p>
                                </div>
                            </Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

interface SectionProps {
    role: string | undefined,
    module: Module;
    title: string;
    slug: string;
    description: string;
    image: string;
    isActive: boolean;
    progress: number;
    totalVideos: number;
    totalDuration: number;
}

const ModuleSection = ({
    role,
    module,
    title,
    slug,
    description,
    image,
    isActive,
    progress,
    totalVideos,
    totalDuration,
} : SectionProps) => {

    const [imgReady, setImgReady] = useState(false);
    const [imgError, setImgError] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver: isOverItem
    } = useSortable({ id: module.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <OutlineSection isActive={isActive} className='relative overflow-hidden group/card space-y-3 flex flex-col'>
                {role === 'admin' &&
                    <div className='bg-neutral-800/80 absolute z-10 inset-x-2 top-2 -translate-y-16 opacity-0 group-hover/card:opacity-100 group-hover/card:-translate-y-0 rounded-full shadow-lg shadow-black/30 flex justify-between items-center gap-4 p-2 transition duration-200'>
                        <Button
                            {...attributes}
                            {...listeners}
                            variant={'transparent'}
                            size={'iconXs'}
                            title="Geser untuk ubah urutan"
                            className='text-neutral-300 hover:text-white'
                        >
                            <GripHorizontal className="w-5 h-5" />
                        </Button>
                        <div className='flex items-center gap-1'>
                            <ModuleEdit module={module} />
                            <ModuleDelete module={module} />
                        </div>
                    </div>
                }
                <div className='h-full grow'>
                    <div onClick={() => imgReady && window.open(image)} className='mb-4 col-span-5 relative aspect-video bg-neutral-800 rounded-lg'>
                        {image && (
                            <>
                                {imgReady && (
                                    <div className='absolute inset-0 opacity-0 hover:opacity-100 hover:cursor-pointer flex items-center justify-center bg-black/50 rounded-t-xl transition-opacity duration-200 text-sm text-nowrap font-semibold'>
                                        Lihat Gambar
                                    </div>
                                )}
                                {imgError && (
                                    <div className='absolute inset-0 flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 rounded-t-xl text-sm gap-2'>
                                        <ImageOffIcon className='size-6 me-1' />
                                        Thumbnail tidak tersedia
                                    </div>
                                )}
                                <img onError={() => { setImgReady(false); setImgError(true) }} onLoad={() => setImgReady(true)} src={image} alt="" width={400} height={225} className='w-full aspect-video object-cover rounded-t-xl' />
                            </>
                        )}
                    </div>
                    <div className='col-span-12 md:col-span-7 text-zinc-400 space-y-2 px-4'>
                        {/* <div className='text-nowrap text-purple-500 font-semibold'>{lessons} Video</div> */}
                        <h6 className='text-2xl md:text-xl font-medium leading-tight text-white'>{title}</h6>
                        <p className='line-clamp-2'>{description}</p>
                        {/* <p className='text-sm text-nowrap'>{module.videos ? module.videos.length : 0} Video dalam {formatDuration(totalDuration)}</p> */}
                    </div>
                </div>
                <div className='flex-auto px-3 pb-3 pt-2 space-y-2'>
                    <div className="flex justify-between items-center gap-2 text-white">
                        <div className="flex items-center gap-2">
                            <ClapperboardIcon className="w-4 h-4 text-purple-500" />
                            <span className='text-sm'>{totalVideos} video</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-purple-500" />
                            <span className='text-sm'>{formatDurationText(totalDuration)}</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div>
                            <div className="relative w-10 h-10">
                                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        className="text-neutral-700"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        className="text-purple-500"
                                        strokeWidth="1.5"
                                        strokeDasharray={`${progress}, 100`}
                                        stroke="currentColor"
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
                                    {progress !== 100 ? `${progress}%` : <CheckIcon className="w-4 h-4" />}
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => router.visit(`/modules/${slug}`)} disabled={!isActive} variant={'secondary'} size={'sm'} className='w-full rounded-lg'>{role === 'admin' ? 'Kelola Modul' : 'Mulai Sekarang'}</Button>
                    </div>
                </div>
            </OutlineSection>
        </div>
    );
}

type ModuleCustom = Module & {
  total_duration: number;
  total_videos_count: number;
  progress_percentage: number;
};

interface Props {
    modules: ModuleCustom[]
}

export default function Modules({ modules } : Props) {
    const { auth } = usePage<SharedData>().props;
    const [items, setItems] = useState(modules.map((m) => m.id));
    const [activeId, setActiveId] = useState<number | null>(null);
    const now = new Date();
    const isAdmin = auth.user.role?.slug === 'admin';
    const isMembershipActive = isAdmin || (auth.user.membership_expires_at ? new Date(auth.user.membership_expires_at) > now : false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        setItems(modules.map((m) => m.id));
    }, [modules]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };
    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);

            // Kirim urutan baru ke backend
            router.post(route('module.reorder'), { order: newItems }, {
                preserveScroll: true,
                preserveState: true,
                only: [],
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modules" />
            <div className="px-4 py-6">
                <Heading title="List Modul" description="Mulailah karier Anda dengan bimbingan yang tepat." />
                {auth.user.role?.slug === 'admin' &&
                    <Modulecreate />
                }
                {!isMembershipActive && (
                    <div className="mb-6 p-8 max-w-4xl rounded-3xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex gap-6">
                        <div>
                            <CrownIcon className="size-8 lg:size-12" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-3xl font-semibold text-white">
                                Akses Eksklusif Menanti Anda
                            </p>
                            <p className="text-neutral-300">
                                Untuk membuka semua modul video pembelajaran dan fitur eksklusif, aktifkan keanggotaan Anda sekarang. Tingkatkan skill Anda tanpa batas bersama membership kami.
                            </p>
                            <div className='mt-4'>
                                {/* <Link
                                    href="/membership"
                                    className="inline-block bg-purple-800 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-xl shadow-purple-500/50"
                                >
                                    Aktifkan Membership Sekarang
                                </Link> */}
                                <Button onClick={() => router.visit('/membership')} className='rounded-full shadow-2xl shadow-white'>Aktifkan Membership Sekarang</Button>
                            </div>
                        </div>
                    </div>
                )}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {modules && modules.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                {items.map((id) => {
                                    const module = modules.find((m) => m.id === id);
                                    if (!module) return null;

                                    return (
                                        <ModuleSection
                                            key={id}
                                            role={auth.user.role?.slug}
                                            module={module}
                                            title={module.title}
                                            slug={module.slug}
                                            description={module.description}
                                            totalDuration={module.total_duration}
                                            totalVideos={module.total_videos_count}
                                            image={`/files/${module.thumbnail}`}
                                            isActive={isMembershipActive}
                                            progress={module.progress_percentage}
                                        />
                                    );
                                })}
                            </SortableContext>

                            {/* <DragOverlay>
                                {activeId ? (() => {
                                    const activeModule = modules.find((m) => m.id === activeId);
                                    if (!activeModule) return null;

                                    return (
                                        // <SortableItem membership={activeMembership} role={auth.user.role?.slug} />
                                        <ModuleSection
                                            role={auth.user.role?.slug}
                                            module={activeModule}
                                            title={activeModule.title}
                                            slug={activeModule.slug}
                                            description={activeModule.description}
                                            lessons={activeModule.videos_count}
                                            duration="2h 30m"
                                            image={`/files/${activeModule.thumbnail}`}
                                            isActive={true}
                                        />
                                    );
                                })() : null}
                            </DragOverlay> */}
                        </DndContext>
                    ) : (
                        <div className='col-span-full'>
                            <div className='py-12 px-6 bg-neutral-900/50 rounded-xl text-center space-y-1'>
                                <h6 className='font-semibold text-neutral-400 leading-tight md:text-2xl'>Data Modul kosong</h6>
                                <p className='text-sm md:text-base text-neutral-500'>Tidak ada Modul yang tersedia. Silahkan tambahkan modul baru.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
