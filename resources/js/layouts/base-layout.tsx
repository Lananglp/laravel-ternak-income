import React from 'react'
import Header from '@/components/custom/header'
import Footer from '@/components/custom/footer'
import { Spotlight } from '@/components/ui/spotlight-new'
import { SparklesCore } from '@/components/ui/sparkles'

function Template({ children, container = true, className, gradient }: { children: React.ReactNode, container?: boolean, className?: string, gradient?: boolean }) {
    return (
        <div className="flex flex-col min-h-svh h-screen">
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
            <div className="flex-grow">
                <Header />
                <div className={`${container && 'lg:mt-8 px-4 max-w-7xl mx-auto'} ${className}`}>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Template