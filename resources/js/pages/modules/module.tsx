import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Vibrant } from 'node-vibrant/browser';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modules',
        href: '/modules',
    },
];

const OutlineSection = ({ children, className, bgColor }: { children: React.ReactNode; className?: string; bgColor?: string | null }) => {
    return (
        // <div className='group/card bg-gradient-to-br from-orange-500 to-transparent rounded-xl'>
        <div
            className='group/card rounded-xl'
            style={{
                backgroundImage: bgColor ? `linear-gradient(to bottom right, ${bgColor}, transparent)` : undefined,
            }}
        >
            <div className={`h-full border border-neutral-900 bg-neutral-950/75 group-hover/card:bg-neutral-950/60 rounded-xl transition-colors duration-200 ${className}`}>
                {children}
            </div>
        </div>
    )
}

const ModuleSection = ({ title, description, lessons, duration, image }: { title: string; description: string; lessons: number; duration: string; image: string }) => {

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
            <OutlineSection className='relative p-3'>
                <PlaceholderPattern className='rounded-lg aspect-video' />
                <div className='p-2 space-y-2'>
                    <h3 className='text-lg font-semibold mt-2'>Loading...</h3>
                    <p className='text-sm text-neutral-400'>Please wait while we load the module details.</p>
                </div>
            </OutlineSection>
        );
    }

    return (
        <OutlineSection className='relative p-3' bgColor={bgColor}>
            <img src={image} alt={title} className='rounded-lg aspect-video object-cover' />
            <div className='p-2 space-y-2' >
                <h3 className='text-lg font-semibold mt-2'>{title}</h3>
                <p className='text-sm text-neutral-400'>{description}</p>
                <p className="my-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className='mr-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-950 to-orange-950 text-white'>{lessons} Lessons</span> {duration}
                </p>
                <Button variant={'secondary'} size={'sm'} className='w-full'>Mulai Sekarang</Button>
            </div>
            {/* <div className='absolute -bottom-4 start-1/2 -translate-x-1/2'>
                <Button variant={'outline'} size={'sm'}>Mulai Sekarang</Button>
            </div> */}
        </OutlineSection>
    );
}

export default function Modules() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modules" />
            <div className="px-4 py-6">
                <Heading title="List of modules" description="Start your career with the right guidance." />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <ModuleSection
                        title="Module 1: Introduction to React"
                        description="Learn the basics of React, including components, state, and props."
                        lessons={8}
                        duration="2h 30m"
                        image="https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg"
                    />
                    <ModuleSection
                        title="Module 2: Advanced React Patterns"
                        description="Dive deeper into React with hooks, context, and performance optimization."
                        lessons={12}
                        duration="3h 15m"
                        image="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
                    />
                    <ModuleSection
                        title="Module 3: State Management with Redux"
                        description="Understand state management in React applications using Redux."
                        lessons={10}
                        duration="2h 45m"
                        image="https://images.pexels.com/photos/386196/pexels-photo-386196.jpeg"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
