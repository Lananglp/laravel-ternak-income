import VideoPlayer from '@/components/custom/video-player';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { formatDuration, formatDurationText } from '@/helper/helper';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Module, ModuleVideo, SharedData, UserVideoProgress } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ImageOffIcon, MoveLeftIcon } from 'lucide-react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import { useEffect, useState } from 'react';

interface props {
    module: Module;
    video: ModuleVideo;
    progress?: UserVideoProgress;
    totalDuration: number;
    moduleProgressPercentage: number;
}

function ModuleVideoPage({ module, video, progress, totalDuration, moduleProgressPercentage }: props) {

    const { auth } = usePage<SharedData>().props;
    const [imgReady, setImgReady] = useState(false);
    const [imgError, setImgError] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Modules', href: '/modules' },
        { title: module.title, href: `/modules/${module.slug}` },
        { title: 'Video', href: `/modules/${module.slug}/video/${video.id}` },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={video.title} />
            <div className="px-4 py-6 space-y-6">
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-4'>
                    <div className='col-span-full lg:col-span-8 space-y-6'>
                        {/* <div>
                            <h6 className='text-lg font-medium'>modul 1 : Tutorial dasar membuat musik menggunakan FL Studio 24</h6>
                            <p className='text-neutral-400 text-sm line-clamp-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, nisi voluptatum, maxime repellendus natus omnis illum, nostrum fugiat libero at minima laudantium suscipit. Aliquid minus obcaecati magni corporis, iste quidem.</p>
                        </div> */}
                        <div className='flex justify-between items-center gap-2'>
                            <Button variant='ghost' onClick={() => router.visit(`/modules/${module.slug}`)}><MoveLeftIcon /> Kembali</Button>
                            <div className='w-full lg:w-72 flex items-center gap-2'>
                                <p className='text-nowrap text-sm'>Progress :</p>
                                <div className="w-full h-2 bg-neutral-600 rounded-full">
                                    <div
                                        className="h-2 bg-purple-500 rounded-full"
                                        style={{ width: `${moduleProgressPercentage}%` }}
                                    />
                                </div>
                                <p className='text-sm'>{moduleProgressPercentage}%</p>
                            </div>
                        </div>
                        <VideoPlayer autoPlay video={video} initialProgress={progress} />
                        <div className='space-y-3'>
                            <h1 className="text-3xl font-semibold">{video.title}</h1>
                            <p className="text-neutral-400">{video.description}</p>
                            {/* <p className="text-sm text-gray-500">
                                Durasi: {Math.floor(video.duration / 60)} menit {video.duration % 60} detik
                            </p> */}
                        </div>
                    </div>
                    <div className='col-span-full lg:col-span-4'>
                        <div className='h-full bg-neutral-900 border border-neutral-800 rounded-xl'>
                            <div>
                                <div className='p-4 border-b border-neutral-800 flex justify-between items-center gap-4'>
                                    <h6 className='text-sm font-medium'>List Video</h6>
                                    <p className='text-xs'>{module.videos ? module.videos.length : 0} Video dalam {formatDuration(totalDuration)}</p>
                                </div>
                            </div>
                            {module.videos &&
                                module.videos.length > 0 &&
                                module.videos.map((item, index) => {
                                    const progress = item.user_progress;
                                    const isCompleted = progress?.is_completed ?? false;
                                    const watchedSeconds = progress?.watched_seconds ?? 0;
                                    const percentage = item.duration > 0 ? Math.min((watchedSeconds / item.duration) * 100, 100) : 0;

                                    return (
                                        <Link
                                            href={`/modules/${module.slug}/video/${item.id}`}
                                            key={index}
                                            className={`${item.id === video.id ? 'bg-neutral-800' : ''
                                                } hover:bg-neutral-800 flex items-center gap-3 px-4 py-2 hover:cursor-pointer`}
                                        >
                                            <div className="flex justify-center items-center text-neutral-400 font-medium text-xs text-nowrap">
                                                {index + 1}
                                            </div>

                                            <div className="w-56 relative overflow-hidden aspect-video bg-neutral-800 rounded-md border border-neutral-700">
                                                {item.thumbnail && (
                                                    <>
                                                        {imgError && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 rounded-md text-sm gap-2">
                                                                <ImageOffIcon className="size-4 me-1" />
                                                            </div>
                                                        )}
                                                        <img
                                                            onError={() => {
                                                                setImgReady(false);
                                                                setImgError(true);
                                                            }}
                                                            onLoad={() => setImgReady(true)}
                                                            src={`/private/images/${item.thumbnail}`}
                                                            alt=""
                                                            width={400}
                                                            height={225}
                                                            className="w-full aspect-video object-cover rounded-md"
                                                        />

                                                        {/* Label SELESAI */}
                                                        {isCompleted && (
                                                            <div className="absolute top-0 end-0 bg-purple-700 text-white rounded-bl-lg text-xs font-medium tracking-wide py-0.5 px-2">
                                                                Selesai
                                                            </div>
                                                        )}

                                                        {/* Durasi */}
                                                        <div className="absolute bottom-1 end-1 bg-black/60 rounded px-1">
                                                            <span className="text-xs text-white font-semibold">
                                                                {formatDuration(item.duration)}
                                                            </span>
                                                        </div>

                                                        {/* Progress Bar */}
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
                                            </div>

                                            <div className="w-full">
                                                <p className="text-sm font-medium line-clamp-3">{item.title}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default ModuleVideoPage