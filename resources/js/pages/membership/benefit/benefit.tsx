import { Button } from '@/components/ui/button';
import { Membership } from '@/types';
import { router } from '@inertiajs/react';
import { CheckIcon, GripVertical, PenIcon, PlusIcon, TrashIcon, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import BenefitCreate from './benefit-create';
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
import BenefitEdit from './benefit-edit';
import BenefitDelete from './benefit-delete';

function SortableBenefitItem({ benefit, membershipId, role }: { benefit: any; membershipId: number, role: string | undefined }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: benefit.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            key={benefit.id}
            className={`relative group/benefit rounded-lg flex items-center gap-1 p-1 ${role === 'admin' && 'hover:bg-neutral-800'}`}
        >
            <div className='flex items-center'>
                {role === 'admin' &&
                    <Button
                        {...attributes}
                        {...listeners}
                        variant={'transparent'}
                        size={'iconSm'}
                        title="Ubah urutan benefit"
                    >
                        <GripVertical className="w-4 h-4 text-neutral-500" />
                    </Button>
                }
                <div
                    className={`flex justify-center items-center w-4 h-4 shrink-0 rounded-full text-white ${benefit.is_active ? 'bg-blue-700' : 'bg-red-700'
                        } mx-1`}
                >
                    {benefit.is_active ? <CheckIcon className="shrink-0 w-3 h-3" /> : <XIcon className="shrink-0 w-3 h-3" />}
                </div>
            </div>
            <p className='text-sm text-neutral-400'>{benefit.benefit}</p>
            {role === 'admin' &&
                <div className='hidden group-hover/benefit:flex items-center absolute end-3 top-1/2 -translate-y-1/2 gap-1'>
                    <BenefitEdit benefit={benefit} membershipId={membershipId} />
                    <BenefitDelete benefit={benefit} membershipId={membershipId} />
                </div>
            }
        </li>
    );
}

function MembershipBenefit({ membership, role }: { membership: Membership, role: string | undefined }) {
    const [items, setItems] = useState<number[]>(
        membership.benefits?.map((b) => b.id) || []
    );
    const [activeId, setActiveId] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    useEffect(() => {
        setItems(membership.benefits?.map((b) => b.id) || []);
    }, [membership.benefits]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);

            router.post(route('benefits.reorder', membership.id), {
                order: newItems,
            });
        }

        setActiveId(null);
    };

    return (
        <div className='space-y-2'>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <ul>
                        {membership.benefits && membership.benefits.length > 0 ? (
                            items.map((id) => {
                                const benefit = membership.benefits?.find((b) => b.id === id);
                                if (!benefit) return null;
                                return (
                                    <SortableBenefitItem
                                        key={benefit.id}
                                        benefit={benefit}
                                        membershipId={membership.id}
                                        role={role}
                                    />
                                );
                            })
                        ) : (
                            <p className='py-1 text-sm text-neutral-500'>Belum ada benefit</p>
                        )}
                    </ul>
                </SortableContext>
                <DragOverlay>
                    {activeId ? (() => {
                        const benefit = membership.benefits?.find((b) => b.id === activeId);
                        if (!benefit) return null;
                        return (
                            <SortableBenefitItem
                                benefit={benefit}
                                membershipId={membership.id}
                                role={role}
                            />
                        );
                    })() : null}
                </DragOverlay>
            </DndContext>
            {role === 'admin' &&
                <div>
                    <BenefitCreate membership_id={membership.id} />
                </div>
            }
        </div>
    );
}

export default MembershipBenefit;
