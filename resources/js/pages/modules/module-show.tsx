import Heading from '@/components/heading'
import AppLayout from '@/layouts/app-layout'
import { Module, SharedData, UserVideoProgress, type BreadcrumbItem } from '@/types'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClapperboardIcon, ClockIcon, GripHorizontal, GripVertical, ImageOffIcon, MoveLeftIcon, PlusIcon } from 'lucide-react'
import { formatDuration, formatDurationText } from '@/helper/helper'
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';

const OutlineSection = ({ children, className }: { children: React.ReactNode; className?: string; bgColor?: string | null }) => {
    return (
        <div className='group/card h-full rounded-2xl bg-neutral-950'>
            <div className='h-full rounded-2xl bg-gradient-to-tr from-neutral-900 to-transparent'>
                <div className='h-full rounded-2xl bg-gradient-to-bl from-neutral-800/30 to-transparent from-[20%] to-[30%]'>
                    <div className={`h-full border border-neutral-800 rounded-2xl transition-colors duration-200 ${className}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface SectionProps {
    role: string | undefined;
    id: number;
    title: string;
    description: string;
    duration: number;
    progress: UserVideoProgress | null;
    image: string;
    isCompleted: boolean;
    percentage: number;
    link: string;
}

const ModuleVideoSection = ({
    role,
    id,
    title,
    description,
    duration,
    progress,
    image,
    isCompleted,
    percentage,
    link,
}: SectionProps) => {

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
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        // opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <OutlineSection className={`relative overflow-hidden group/card border ${isOverItem ? 'border-dashed border-neutral-500' : 'border-transparent'} flex items-center p-3`}>
                <div className='flex justify-between items-center gap-4'>
                    <Button
                        {...attributes}
                        {...listeners}
                        variant={'transparent'}
                        size={'iconXs'}
                        title="Geser untuk ubah urutan"
                        className='text-neutral-300 hover:text-white'
                    >
                        <GripVertical className="w-5 h-5" />
                    </Button>
                    {/* <div className='flex items-center gap-1'>
                        <ModuleEdit module={module} />
                        <ModuleDelete module={module} />
                    </div> */}
                </div>
                <Link href={link} className='relative block overflow-hidden aspect-video w-96 bg-neutral-800 rounded-xl border border-neutral-700'>
                    {image && (
                        <>
                            {imgError && (
                                <div className='absolute inset-0 flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 rounded-xl text-sm gap-2'>
                                    <ImageOffIcon className='size-6 me-1' />
                                    Thumbnail tidak tersedia
                                </div>
                            )}
                            <img onError={() => { setImgReady(false); setImgError(true) }} onLoad={() => setImgReady(true)} src={image} alt="" width={400} height={225} className='w-full aspect-video object-cover rounded-xl' />
                            {isCompleted && (
                                <div className="absolute top-0 end-0 bg-purple-700 text-white rounded-bl-lg text-xs font-medium tracking-wide py-1 px-2">
                                    Sudah ditonton
                                </div>
                            )}
                            <div className="absolute bottom-1 end-1 bg-black/60 rounded px-2">
                                <span className="text-xs text-white font-semibold">
                                    {formatDuration(duration)}
                                </span>
                            </div>
                            {progress && !isCompleted && (
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-neutral-400">
                                    <div
                                        className="h-1.5 bg-purple-600"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Link>
                <div className='basis-full text-zinc-400 space-y-2 px-2 lg:px-4'>
                    <Link href={link} className='inline-block lg:text-lg font-medium leading-tight text-white line-clamp-4 lg:line-clamp-2'>{title}</Link>
                    <Link href={link} className='hidden lg:block'>
                        <p className='text-sm line-clamp-2'>{description}</p>
                    </Link>
                </div>
            </OutlineSection>
        </div>
    );
}

interface Props {
    module: Module;
    totalDuration: number;
    moduleProgressPercentage: number;
}

export default function ModuleShow({ module, totalDuration, moduleProgressPercentage }: Props) {

    const { auth } = usePage<SharedData>().props;
    const [imgError, setImgError] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Modules', href: '/modules' },
        { title: module.title, href: `/modules/${module.slug}` },
    ]

    const [items, setItems] = useState(module.videos && module.videos.map((m) => m.id));
    const [activeId, setActiveId] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        setItems(module.videos && module.videos.map((m) => m.id));
    }, [module.videos]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };
    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items?.indexOf(active.id) || 0;
            const newIndex = items?.indexOf(over.id) || 0;

            const newItems = arrayMove(items || [], oldIndex, newIndex);
            setItems(newItems);

            // Kirim urutan baru ke backend
            router.post(route('module.video.reorder', module.slug), { order: newItems }, {
                preserveScroll: true,
                preserveState: true,
                only: [],
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={module.title} />
            <div className="px-4 py-6 space-y-6">
                <div className='relative overflow-hidden h-80 w-full bg-neutral-900 rounded-t-xl'>
                    {module.thumbnail && (
                        <>
                            {imgError && (
                                <div className='absolute inset-0 flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 rounded-t-xl text-sm gap-2'>
                                    <ImageOffIcon className='size-6 me-1' />
                                    Thumbnail tidak tersedia
                                </div>
                            )}
                            <img onError={() => { setImgError(true) }} src={`/files/${module.thumbnail}`} alt="" width={400} height={225} className='w-full aspect-video object-cover rounded-t-xl' />
                        </>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950' />
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950 from-70% to-100%' />
                    <div className='absolute inset-0 bg-gradient-to-l from-transparent to-neutral-950 from-70% to-100%' />
                    <div className='absolute inset-0 bg-gradient-to-t from-transparent to-neutral-950 from-70% to-100%' />
                    <div className='absolute inset-0 flex justify-center items-end'>
                        <div className='max-w-xl mx-auto text-center px-6 lg:px-0 space-y-4 pb-8'>
                            <h1 className='font-poppins text-xl lg:text-3xl font-semibold text-white line-clamp-3'>{module.title}</h1>
                            <p className='text-sm lg:text-base text-neutral-300 line-clamp-4'>{module.description}</p>
                        </div>
                    </div>
                    <div className='absolute inset-x-0 top-0'>
                        <div className='flex justify-between items-center gap-2'>
                            <Button variant='ghost' onClick={() => router.visit(`/modules`)}><MoveLeftIcon /> Kembali</Button>
                            <Button variant='outline' onClick={() => router.visit(`/modules/${module.slug}/create`)}><PlusIcon /> Tambahkan Video</Button>
                        </div>
                    </div>
                </div>
                

                <div>
                    <div className="max-w-3xl mx-auto grid grid-cols-1 gap-4">
                        <div className='flex justify-between items-center gap-4'>
                            <div className='w-1/2 lg:w-72 flex items-center gap-2'>
                                <p className='hidden lg:inline-block text-nowrap text-sm'>Progress :</p>
                                <div className="w-full h-2 bg-neutral-600 rounded-full">
                                    <div
                                        className="h-2 bg-purple-500 rounded-full"
                                        style={{ width: `${moduleProgressPercentage}%` }}
                                    />
                                </div>
                                <p className='text-sm'>{moduleProgressPercentage}%</p>
                            </div>
                            <div className="flex items-center gap-2 text-white">
                                <div className="flex items-center gap-2">
                                    <ClapperboardIcon className="w-4 h-4 text-purple-500" />
                                    <span className='text-sm'>{module.videos ? module.videos.length : 0} video</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4 text-purple-500" />
                                    <span className='text-sm'>{formatDurationText(totalDuration)}</span>
                                </div>
                            </div>
                        </div>
                        {module && module.videos && module.videos.length > 0 ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={items || []} strategy={verticalListSortingStrategy}>
                                    {items && items.map((id) => {
                                        const videos = module.videos?.find((m) => m.id === id);
                                        if (!videos) return null;

                                        const isCompleted = videos.user_progress?.is_completed ?? false;
                                        const progress = videos.user_progress;
                                        const watchedSeconds = progress?.watched_seconds ?? 0;
                                        const percentage = videos.duration > 0 ? Math.min((watchedSeconds / videos.duration) * 100, 100) : 0;

                                        return (
                                            <ModuleVideoSection
                                                key={id}
                                                role={auth.user.role?.slug}
                                                id={videos.id}
                                                title={videos.title}
                                                link={`/modules/${module.slug}/video/${videos.id}`}
                                                description={videos.description}
                                                duration={videos.duration}
                                                image={`/private/images/${videos.thumbnail}`}
                                                isCompleted={isCompleted}
                                                progress={progress}
                                                percentage={percentage}
                                            />
                                        );
                                    })}
                                </SortableContext>

                                {/* <DragOverlay>
                                    {activeId ? (() => {
                                        const activeVideos = module.videos?.find((m) => m.id === activeId);
                                        if (!activeVideos) return null;

                                        const isCompleted = activeVideos.user_progress?.is_completed ?? false;
                                        const progress = activeVideos.user_progress;
                                        const watchedSeconds = progress?.watched_seconds ?? 0;
                                        const percentage = activeVideos.duration > 0 ? Math.min((watchedSeconds / activeVideos.duration) * 100, 100) : 0;

                                        return (
                                            <ModuleVideoSection
                                                role={auth.user.role?.slug}
                                                id={activeVideos.id}
                                                title={activeVideos.title}
                                                description={activeVideos.description}
                                                duration={activeVideos.duration}
                                                image={`/files/${activeVideos.thumbnail}`}
                                                isCompleted={isCompleted}
                                                progress={progress}
                                                percentage={percentage}
                                            />
                                        );
                                    })() : null}
                                </DragOverlay> */}
                            </DndContext>
                        ) : (
                            <div className='col-span-full'>
                                <div className='py-12 px-6 text-center space-y-1'>
                                    <h6 className='font-semibold text-neutral-400 leading-tight md:text-2xl'>belum ada video</h6>
                                    <p className='text-sm md:text-base text-neutral-500'>Belum ada video yang tersedia untuk saat ini.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
