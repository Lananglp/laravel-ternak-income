import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Template from '@/layouts/base-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { MessageCircleMore, SparklesIcon, UserRoundIcon } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <Template>
                <section className="space-y-6">
                    <div className="flex items-center justify-center">
                        <div className="max-w-3xl text-center space-y-4 py-12">
                            <h1 className="font-righteous text-5xl md:text-6xl leading-tight md:leading-tight text-transparent bg-clip-text bg-gradient-to-r from-red-700 dark:from-red-300 to-black dark:to-white">Laravel Auth Starter Kit</h1>
                            <p className="leading-7">Website ini dibuat oleh Kadek Lanang Lanusa Putera, seorang Frontend Developer sejak tahun 2023. Informasi lebih lengkap tentang saya dapat dilihat melalui tautan berikut.</p>
                            <Button onClick={() => window.open('https://my-web-portofolio-pearl.vercel.app/', '_blank')} type="button" variant={'headerOutline'} size={'lg'}><UserRoundIcon />Tentang Saya</Button>
                        </div>
                    </div>
                    <div className="pt-8 md:pt-0">
                        <h6 className="text-xl text-center font-semibold text-black dark:text-red-100">Apa saja isi dari template ini?</h6>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <div className="h-full md:ps-[1px] md:pt-[1px] md:bg-gradient-to-br from-red-500 from-[0%] to-transparent to-[50%] rounded-xl">
                                <div className="flex flex-row xl:flex-col gap-x-6 h-full p-4 md:p-6 bg-white dark:bg-zinc-950 md:bg-transparent md:bg-gradient-to-br from-zinc-100 dark:from-zinc-900/90 from-[0%] to-white/25 dark:to-zinc-950 to-[100%] rounded-xl">
                                    <div className="mb-2 mt-1 xl:mt-0">
                                        <SparklesIcon className="text-red-300" />
                                    </div>
                                    <div>
                                        <h6 className="mb-2 font-semibold text-black dark:text-red-100">Login Google</h6>
                                        <p className="text-sm">Sudah terintegrasi dengan login Google menggunakan socialite, anda juga dapat mencustomisasi login dengan provider lain.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="h-full md:ps-[1px] md:pt-[1px] md:bg-gradient-to-br from-red-500 from-[0%] to-transparent to-[50%] rounded-xl">
                                <div className="flex flex-row xl:flex-col gap-x-6 h-full p-4 md:p-6 bg-white dark:bg-zinc-950 md:bg-transparent md:bg-gradient-to-br from-zinc-100 dark:from-zinc-900/90 from-[0%] to-white/25 dark:to-zinc-950 to-[100%] rounded-xl">
                                    <div className="mb-2 mt-1 xl:mt-0">
                                        <SparklesIcon className="text-red-300" />
                                    </div>
                                    <div>
                                        <h6 className="mb-2 font-semibold text-black dark:text-red-100">Sessions Management</h6>
                                        <p className="text-sm">Sudah terdapat fitur manajemen sessions, dimana anda dapat melihat daftar sessions yang sedang aktif.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="h-full md:ps-[1px] md:pt-[1px] md:bg-gradient-to-br from-red-500 from-[0%] to-transparent to-[50%] rounded-xl">
                                <div className="flex flex-row xl:flex-col gap-x-6 h-full p-4 md:p-6 bg-white dark:bg-zinc-950 md:bg-transparent md:bg-gradient-to-br from-zinc-100 dark:from-zinc-900/90 from-[0%] to-white/25 dark:to-zinc-950 to-[100%] rounded-xl">
                                    <div className="mb-2 mt-1 xl:mt-0">
                                        <SparklesIcon className="text-red-300" />
                                    </div>
                                    <div>
                                        <h6 className="mb-2 font-semibold text-black dark:text-red-100">Menu accounts</h6>
                                        <p className="text-sm">Tidak perlu membuat menu accounts lagi, di template ini sudah terdapat menu accounts.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Template>
        </>
    );
}
