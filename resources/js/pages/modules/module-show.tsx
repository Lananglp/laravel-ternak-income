import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modules',
        href: '/modules',
    },
];

// const OutlineSection = ({ children, className }: { children: React.ReactNode; className?: string }) => {
//     return (
//         <div className='group/card bg-gradient-to-br from-orange-500 to-transparent to-50% rounded-xl ps-[1px] pt-[1px]'>
//             <div className={`h-full border border-neutral-900 bg-neutral-950/90 group-hover/card:bg-neutral-950/70 rounded-xl transition-colors duration-200 ${className}`}>
//                 {children}
//             </div>
//         </div>
//     )
// }

// const ModuleSection = ({ title, description, lessons, duration, image }: { title: string; description: string; lessons: number; duration: string; image: string }) => {
//     return (
//         <OutlineSection className='relative p-3'>
//             <img src={image} alt={title} className='rounded-lg aspect-video object-cover' />
//             <div className='p-2 space-y-2'>
//                 <h3 className='text-lg font-semibold mt-2'>{title}</h3>
//                 <p className='text-sm text-neutral-400'>{description}</p>
//                 <p className="my-4 text-sm text-neutral-500 dark:text-neutral-400">
//                     <span className='mr-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-950 to-orange-950 text-white'>{lessons} Lessons</span> {duration}
//                 </p>
//                 <Button variant={'outline'} size={'sm'} className='w-full'>Mulai Sekarang</Button>
//             </div>
//             {/* <div className='absolute -bottom-4 start-1/2 -translate-x-1/2'>
//                 <Button variant={'outline'} size={'sm'}>Mulai Sekarang</Button>
//             </div> */}
//         </OutlineSection>
//     );
// }

export default function ModuleShow({ id }: { id: string }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modules" />
            <div className="px-4 py-6">
                <Heading title="Module 1: Introduction to React" description="Learn the basics of React, including components, state, and props." />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    
                </div>
            </div>
        </AppLayout>
    );
}
