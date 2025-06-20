import AppLogoIcon from '@/components/app-logo-icon';
import { SparklesCore } from '@/components/ui/sparkles';
import { Spotlight } from '@/components/ui/spotlight-new';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <>
            <div className="fixed inset-0 bg-gradient-to-br from-red-500/5 from-[0%] via-transparent via-[55%] to-red-500/5 to-[0%] pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-tr from-transparent from-[0%] via-transparent via-[65%] to-red-500/5 to-[0%] pointer-events-none" />
                <Spotlight />
                <div className="hidden dark:block w-full absolute -z-10 pointer-events-none inset-0 h-screen">
                    <SparklesCore
                        id="tsparticlesfullpage"
                        background="transparent"
                        minSize={0.6}
                        speed={1}
                        maxSize={1.4}
                        particleDensity={10}
                        className="w-full h-full"
                        particleColor="#FFFFFF"
                    />
                </div>
            </div>
            <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                                <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                    <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-muted-foreground text-center text-sm">{description}</p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
