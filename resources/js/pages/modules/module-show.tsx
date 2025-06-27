import Heading from '@/components/heading'
import AppLayout from '@/layouts/app-layout'
import { Module, type BreadcrumbItem } from '@/types'
import { Head, usePage } from '@inertiajs/react'

interface Video {
    id: number
    title: string
    description: string | null
    video_url: string
    duration: number
    position: number
}

export default function ModuleShow({ module }: { module: Module }) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Modules', href: '/modules' },
        { title: module.title, href: `/modules/${module.slug}` },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={module.title} />
            <div className="px-4 py-6 space-y-6">
                <Heading title={module.title} description={module.description} />

                <h2 className="text-lg font-semibold">Daftar Video</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* {module.videos.length === 0 ? (
                        <p className="text-gray-500">Belum ada video pembelajaran.</p>
                    ) : (
                        module.videos.map((video) => (
                            <div key={video.id} className="border rounded-lg p-4 shadow-sm">
                                <h3 className="font-semibold text-base mb-1">{video.position}. {video.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                                <p className="text-xs text-gray-400 mt-2">Durasi: {Math.floor(video.duration / 60)} menit</p>
                                <a
                                    href={`/videos/${video.id}`}
                                    className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
                                >
                                    Tonton Video →
                                </a>
                            </div>
                        ))
                    )} */}
                </div>
            </div>
        </AppLayout>
    )
}
