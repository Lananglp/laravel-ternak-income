import { ModuleVideo, UserVideoProgress } from '@/types'
import { router } from '@inertiajs/react';
import axios from 'axios';
import Plyr from 'plyr-react'
import { useEffect, useRef } from 'react';

export function useVideoProgress(
    videoId: number,
    initialProgress?: UserVideoProgress | null
) {
    const lastSent = useRef(0);
    const maxWatched = useRef(initialProgress?.watched_seconds ?? 0);
    const alreadyCompleted = useRef(initialProgress?.is_completed ?? false);

    const handleTimeUpdate = async (currentTime: number, duration: number) => {
        const isCompleted = currentTime >= duration - 3;

        // Jangan kirim progress kalau mundur dari sebelumnya
        if (currentTime < maxWatched.current) return;

        // Jangan kirim lagi kalau sudah selesai
        if (alreadyCompleted.current) return;

        // Kirim hanya jika sudah 10 detik lebih atau sudah selesai
        if (Math.abs(currentTime - lastSent.current) > 10 || isCompleted) {
            lastSent.current = currentTime;

            try {
                await axios.post(route('video.progress.update'), {
                    video_id: videoId,
                    watched_seconds: Math.floor(currentTime),
                    is_completed: isCompleted,
                });

                // Update state lokal biar gak spam kirim ulang
                maxWatched.current = currentTime;
                if (isCompleted) alreadyCompleted.current = true;
            } catch (error) {
                console.error('Gagal menyimpan progress video:', error);
            }
        }
    };

    return { handleTimeUpdate };
}

function VideoPlayer({
    video,
    initialProgress,
    autoPlay = false,
}: {
    video: ModuleVideo;
    initialProgress?: UserVideoProgress | null;
    autoPlay?: boolean;
}) {
    const { handleTimeUpdate } = useVideoProgress(video.id, initialProgress);
    const playerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const videoEl = playerRef.current?.querySelector('video');
        if (!videoEl) return;

        const resumeAt = initialProgress?.is_completed
            ? 0 // Sudah selesai, mulai dari awal
            : initialProgress?.watched_seconds ?? 0;

        const handleLoaded = () => {
            if (resumeAt > 0 && videoEl.duration > resumeAt) {
                videoEl.currentTime = resumeAt;
            }
        };

        const onTimeUpdate = () => {
            handleTimeUpdate(videoEl.currentTime, videoEl.duration);
        };

        videoEl.addEventListener('loadedmetadata', handleLoaded);
        videoEl.addEventListener('timeupdate', onTimeUpdate);

        return () => {
            videoEl.removeEventListener('loadedmetadata', handleLoaded);
            videoEl.removeEventListener('timeupdate', onTimeUpdate);
        };
    }, [handleTimeUpdate, initialProgress]);

    return (
        <div className="aspect-video rounded-2xl overflow-hidden" ref={playerRef}>
            <Plyr
                source={{
                    type: 'video',
                    title: video.title,
                    sources: [
                        {
                            src: `/private/${video.video_url}`,
                            type: 'video/mp4',
                            size: 720,
                        },
                    ],
                    poster: `/private/images/${video.thumbnail}`,
                }}
                options={{
                    autoplay: autoPlay,
                    controls: [
                        'play-large',
                        'play',
                        'progress',
                        'current-time',
                        'mute',
                        'volume',
                        'captions',
                        'settings',
                        'fullscreen',
                    ],
                    quality: {
                        default: 720,
                        options: [720],
                    },
                }}
            />
        </div>
    )
}

export default VideoPlayer