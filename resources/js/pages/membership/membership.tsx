import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Membership, SharedData, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { GripVertical } from 'lucide-react';
import MembershipCreate from './membership-create';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/helper/helper';
import MembershipEdit from './membership-edit';
import MembershipDelete from './membership-delete';
import MembershipBenefit from './benefit/benefit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Membership',
        href: '/membership',
    },
];

function SortableItem({ membership, role }: { membership: Membership, role: string | undefined }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver: isOverItem
    } = useSortable({ id: membership.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    // const { flash } = usePage<SharedData>().props;

    const handleBuy = (membershipId: number) => {
        router.post(
            route('membership.pay', membershipId), // <--- sesuai dengan route baru
            {},
            {
                preserveScroll: true,
                // onSuccess: (page) => {
                //     const token = page.props.flash?.snap_token || null;

                //     if (!token) {
                //         alert('Gagal mendapatkan token pembayaran');
                //         return;
                //     }

                //     window.snap.pay(token, {
                //         onSuccess: function (result) {
                //             alert('Pembayaran berhasil!');
                //             window.location.reload();
                //         },
                //         onPending: function () {
                //             alert('Menunggu pembayaran...');
                //         },
                //         onError: function () {
                //             alert('Pembayaran gagal!');
                //         },
                //         onClose: function () {
                //             alert('Kamu menutup popup pembayaran.');
                //         },
                //     });
                // },
            }
        );
    };

    return (
        <div ref={setNodeRef} style={style} className={`rounded-xl border ${isOverItem ? 'border-dashed border-neutral-500' : 'border-transparent'}`}>
            <div className={`bg-neutral-950 rounded-2xl`}>
                <div className={`bg-gradient-to-r from-neutral-900 to-transparent border border-neutral-800 rounded-xl p-4 flex flex-row items-center gap-1`}>
                    {role === 'admin' &&
                        <Button
                            {...attributes}
                            {...listeners}
                            variant={'transparent'}
                            size={'iconXs'}
                            title="Geser untuk ubah urutan"
                        >
                            <GripVertical className="w-5 h-5 text-neutral-500" />
                        </Button>
                    }
                    <div className='w-full text-zinc-400'>
                        <div className='flex justify-between gap-10'>
                            <div className='font-semibold text-orange-200'>{membership.name}</div>
                            <div className='text-nowrap text-white font-semibold'>{formatRupiah(membership.price)}</div>
                        </div>
                        <div className='flex justify-between gap-10'>
                            <div className='text-sm'>{membership.tagline}</div>
                            <div className='text-nowrap text-sm'>{membership.duration_days ? `${membership.duration_days} Hari` : 'Selamanya'}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-neutral-900 border-x border-b border-neutral-800 rounded-b-xl mx-3 px-3 pb-3 pt-2 space-y-2'>
                {role === 'admin' &&
                    <div className='flex justify-between items-center gap-2 mb-2 border-b pb-2'>
                        <h6 className='text-sm'>Benefit :</h6>
                        <div className='flex items-center space-x-2'>
                            <MembershipEdit membership={membership} />
                            <MembershipDelete membership={membership} />
                        </div>
                    </div>
                }
                <MembershipBenefit membership={membership} role={role} />
                {role === 'user' &&
                    <Button
                        variant={'primary'}
                        className='w-full rounded-lg mt-2'
                        onClick={() => handleBuy(membership.id)}
                    >
                        Beli Sekarang
                    </Button>
                }
            </div>
        </div>
    );
}

interface MembershipProps {
    memberships: Membership[];
}

export default function MembershipPage({ memberships }: MembershipProps) {
    const { auth } = usePage<SharedData>().props;
    const [items, setItems] = useState(memberships.map((m) => m.id));
    const [activeId, setActiveId] = useState<number | null>(null);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        setItems(memberships.map((m) => m.id));
    }, [memberships]);
    
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
            router.post(route('membership.reorder'), { order: newItems });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Membership" />
            <div className="px-4 py-6">
                <Heading title="Membership Plans" description="Kelola data membership anda." />
                {auth.user.role?.slug === 'admin' &&
                    <div className='mb-4'>
                        <MembershipCreate />
                    </div>
                }
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {memberships && memberships.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                {items.map((id) => {
                                    const membership = memberships.find((m) => m.id === id);
                                    if (!membership) return null;

                                    return <SortableItem key={id} membership={membership} role={auth.user.role?.slug} />;
                                })}
                            </SortableContext>

                            <DragOverlay>
                                {activeId ? (() => {
                                    const activeMembership = memberships.find((m) => m.id === activeId);
                                    if (!activeMembership) return null;

                                    return <SortableItem membership={activeMembership} role={auth.user.role?.slug} />;
                                })() : null}
                            </DragOverlay>
                        </DndContext>
                    ) : (
                        <div className='col-span-3'>
                            <div className='py-12 px-6 bg-neutral-900/50 rounded-xl text-center space-y-1'>
                                <h6 className='font-semibold text-neutral-400 leading-tight md:text-2xl'>Data membership kosong</h6>
                                <p className='text-sm md:text-base text-neutral-500'>Tidak ada membership yang tersedia. Silahkan tambahkan membership baru.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
