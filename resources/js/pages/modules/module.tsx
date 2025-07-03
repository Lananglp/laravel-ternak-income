import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Module, SharedData, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Vibrant } from 'node-vibrant/browser';
import { EyeIcon, GripHorizontal, ImageOffIcon, LockIcon, PenIcon, TrashIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ModuleEdit from './module-edit';
import Modulecreate from './module-create';
import ModuleDelete from './module-delete';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modules',
        href: '/modules',
    },
];

export const OutlineSection = ({ children, className, bgColor, isActive=false }: { children: React.ReactNode; className?: string; bgColor?: string | null, isActive?: boolean }) => {
    return (
        // <div className='group/card bg-gradient-to-br from-orange-500 to-transparent rounded-xl'>
        <div
            className='group/card rounded-xl h-full'
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

const ModuleSection = ({ role, module, title, slug, description, lessons, duration, image, isActive }: { role: string | undefined, module: Module; title: string; slug: string; description: string; lessons: number; duration: string; image: string, isActive: boolean }) => {

    const [imgReady, setImgReady] = useState(false);
    const [imgError, setImgError] = useState(false);

    const [bgColor, setBgColor] = useState<string | null>(null);
    const [textColor, setTextColor] = useState<string>('#ffffff');
    const [isColorReady, setIsColorReady] = useState<boolean>(false);

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
        <div ref={setNodeRef} style={style}>
            <OutlineSection isActive={isActive} className='relative space-y-3 flex flex-col p-4' bgColor={bgColor}>
                {/* <div className={`bg-gradient-to-bl from-neutral-900/15 to-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 flex flex-col`}> */}
                <div className='h-full grow space-y-3'>
                    {role === 'admin' &&
                        <div className='flex justify-between items-center gap-4'>
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
                            <div className='flex items-center gap-2'>
                                <ModuleEdit module={module} />
                                <ModuleDelete module={module} />
                            </div>
                        </div>
                    }
                    <div className='space-y-3'>
                        <div onClick={() => imgReady && window.open(image)} className='col-span-5 relative aspect-video bg-neutral-800 rounded-lg'>
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
                                    <img onError={() => { setImgReady(false); setImgError(true) }} onLoad={() => setImgReady(true)} src={image} alt="" width={400} height={225} className='w-full aspect-video object-cover rounded-lg' />
                                </>
                            )}
                        </div>
                        <div className='col-span-12 md:col-span-7 text-zinc-400 space-y-2'>
                            {/* <div className='text-nowrap text-orange-500 font-semibold'>{lessons} Video</div> */}
                            <h6 className='text-lg font-medium leading-tight text-white'>{title}</h6>
                            <p className='text-sm line-clamp-2'>{description}</p>
                        </div>
                    </div>
                </div>
                <div className='flex-auto'>
                    <Button onClick={() => router.visit(`/modules/${slug}`)} disabled={!isActive} variant={'secondary'} size={'sm'} className='w-full'>{role === 'admin' ? 'Kelola Modul' : 'Mulai Sekarang'}</Button>
                </div>
                {/* </div> */}
            </OutlineSection>
        </div>
    );
}

export default function Modules({ modules }: { modules: Module[] }) {
    const { auth } = usePage<SharedData>().props;
    const [items, setItems] = useState(modules.map((m) => m.id));
    const [activeId, setActiveId] = useState<number | null>(null);

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
            router.post(route('module.reorder'), { order: newItems });
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
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4'>
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
                                            lessons={module.videos_count}
                                            duration="2h 30m"
                                            image={`/files/${module.thumbnail}`}
                                            isActive={true}
                                        />
                                    );
                                })}
                            </SortableContext>

                            <DragOverlay>
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
                            </DragOverlay>
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
