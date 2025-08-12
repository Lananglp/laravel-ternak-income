import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SparklesCore } from '@/components/ui/sparkles';
import { formatRupiah } from '@/helper/helper';
import { Membership, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CameraIcon, ChartLineIcon, CheckIcon, CrownIcon, SparklesIcon, UsersRoundIcon, XIcon } from 'lucide-react';

interface CardPricingProps {
    label: string;
    price: number;
    priceDuration: string;
    description?: string;
    features?: {
        type: "check" | "disabled";
        label: string;
    }[];
}

const CardPricing = ({ label, price, priceDuration, description, features }: CardPricingProps) => {
    return (
        <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
            <div className='h-full p-4 sm:p-6 xl:p-8 flex flex-col bg-neutral-950/85 rounded-3xl shadow-2xl shadow-black'>
                <div className='grow space-y-4'>
                    <h5 className="mb-4 text-xl font-medium text-neutral-300">{label}</h5>
                    <div className="flex items-baseline text-neutral-900 dark:text-white">
                        {/* <span className="text-3xl font-semibold">Rp.</span> */}
                        <span className="text-4xl font-semibold tracking-tight ">{formatRupiah(price)}</span>
                        <span className="ms-1 text-xl font-normal text-neutral-500 dark:text-neutral-400">/ {priceDuration}</span>
                    </div>
                    {description && <p className='text-lg text-neutral-300'>{description}</p>}
                    <ul role="list" className="space-y-5 my-7">
                        {features && features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                                <div className={`flex justify-center items-center w-4 h-4 shrink-0 rounded-full text-white ${feature.type === 'check' ? 'bg-blue-700' : 'bg-red-700'}`}>
                                    {feature.type === 'check' ? (
                                        <CheckIcon className="shrink-0 w-3 h-3" />
                                    ) : (
                                        <XIcon className="shrink-0 w-3 h-3" />
                                    )}
                                </div>
                                <span className={`text-base font-normal leading-tight ${feature.type === 'check' ? 'text-neutral-500 dark:text-neutral-400 ms-3' : 'text-neutral-400 dark:text-neutral-500 ms-3'}`}>
                                    {feature.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='flex-none'>
                    <button type="button" className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 font-medium rounded-full text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Dapatkan</button>
                </div>
            </div>
        </div>
    )
}

export default function Welcome({ memberships }: { memberships: Membership[] }) {
    const { auth } = usePage<SharedData>().props;
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

    return (
        <>
            <Head title="Welcome">
            </Head>

            <div className="relative">
                <div className="hidden dark:block w-full fixed z-10 pointer-events-none inset-0 h-screen">
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
                <header className='mb-4 px-4 py-3 static top-0 z-20 bg-neutral-900/50 backdrop-blur-sm border-b border-neutral-900'>
                    <div className='max-w-screen-xl mx-auto flex justify-between items-center gap-2'>
                        <Link href={route('home')}>
                            <div className="flex items-center gap-2">
                                <AppLogoIcon className="size-9 fill-current text-red-500" />
                                <h1 className="text-xl font-medium text-white">{appName}</h1>
                            </div>
                        </Link>
                        <nav className="flex items-center justify-end gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href='#'
                                        className="inline-block rounded-full px-4 py-1.5 text-sm leading-normal font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                                    >
                                        <CrownIcon className='inline h-4 w-4 md:me-2 md:mb-1' /><span className='hidden md:inline'>Gabung Sekarang</span>
                                    </Link>
                                    <div className='h-8'>
                                        <Separator orientation='vertical' />
                                    </div>
                                    <Link
                                        href={route('login')}
                                        // className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                        className="inline-block rounded-full border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Masuk
                                    </Link>
                                    {/* <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Buat Akun
                                    </Link> */}
                                </>
                            )}
                        </nav>
                    </div>
                </header>
                <main className='pt-6 sm:pt-12 xl:pt-16'>
                    <section>
                        <div className='relative max-w-screen-xl mx-auto'>
                            <div className='absolute top-0 end-1/2 opacity-15 h-64 w-64 bg-linear-0 bg-neutral-500 blur-[6rem] rounded-full pointer-events-none'></div>
                            <div className='absolute top-36 start-0 opacity-15 h-48 w-48 bg-linear-0 bg-neutral-500 blur-[6rem] rounded-full pointer-events-none'></div>
                            <div className='absolute bottom-0 start-1/2 opacity-20 h-28 w-28 bg-linear-0 bg-neutral-500 blur-[6rem] rounded-full pointer-events-none'></div>

                            <div className='relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-12 px-4 sm:px-8'>
                                <div className='lg:col-span-6 space-y-8'>
                                    <h2 className="max-w-sm sm:max-w-2xl text-3xl lg:text-5xl tracking-tight leading-snug font-medium text-neutral-900 dark:text-white">Bagaimana Cara Saya Menghasilkan <span className='font-semibold bg-white text-black px-4 rounded-full'>Rp1 Miliar</span> dengan Menjual Produk Digital Pakai ChatGPT</h2>
                                    <p className="text-neutral-300 sm:text-xl sm:leading-8">Serap ilmu teknis membuat dan menjual digital produk <br className='hidden xl:inline' /> 10 juta+ per bulan yang saya terapkan.</p>
                                    <Link href="#pricing" className='hidden lg:inline-block text-nowrap bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-full px-8 py-3 text-xl font-medium'><CrownIcon className='inline h-6 w-6 me-2 mb-1' />Gabung Sekarang</Link>
                                </div>
                                <div className='lg:col-span-6'>
                                    <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-2xl md:rounded-3xl ps-[1px] pt-[1px]'>
                                        <iframe className='bg-black aspect-video w-full rounded-2xl md:rounded-3xl border border-neutral-900/50' src="https://www.youtube.com/embed/7vDA6MFWVeI?si=bAgkxh1Cwlt8kX9I" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                                    </div>
                                </div>
                            </div>

                            <div className='max-w-3xl mx-auto relative lg:hidden flex justify-center items-center gap-4 sm:gap-8 py-12'>
                                <div className='w-32 h-[1px] bg-neutral-900' />
                                <Link href="#pricing" className='inline-block text-nowrap bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-full px-8 py-3 text-xl font-medium'><CrownIcon className='inline h-6 w-6 me-2 mb-1' />Gabung Sekarang</Link>
                                <div className='w-32 h-[1px] bg-neutral-900' />
                            </div>
                        </div>
                    </section>

                    <section className='sm:mt-12 sm:mb-20'>
                        <div className="py-6 mx-auto max-w-screen-md px-4">
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 text-neutral-400 font-unbounded">
                                <div className='text-center text-2xl font-bold'>Youtube</div>
                                <div className='text-center text-2xl font-bold'>Tiktok</div>
                                <div className='text-center text-2xl font-bold'>Instagram</div>
                            </div>
                        </div>
                    </section>

                    {/* <section>
                        <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
                            <dl className="grid max-w-screen-md gap-8 mx-auto text-neutral-900 dark:text-white">
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl md:text-4xl font-extrabold">1000+</dt>
                                    <dd className="font-light text-neutral-500 dark:text-neutral-400">Member</dd>
                                </div>
                            </dl>
                        </div>
                    </section> */}

                    <section className='mb-20 max-w-screen-xl mx-auto px-4 sm:px-0'>
                        <div className="mb-8 lg:mb-16 text-center">
                            <h2 className="mb-4 text-4xl lg:text-6xl tracking-tight font-semibold text-neutral-900 dark:text-white">Untuk siapa ini?</h2>
                        </div>

                        <div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                    <div className='h-full p-4 sm:p-8 xl:p-12 bg-neutral-950/85 rounded-3xl shadow-2xl shadow-black'>
                                        <div className='mb-2 inline-block bg-neutral-950 text-white rounded-full p-3'>
                                            <ChartLineIcon className='h-7 w-7' />
                                        </div>
                                        {/* <h6 className='font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300'>pemula serius / orang awam</h6> */}
                                        <h6 className='mb-6 font-semibold text-2xl text-white'>pemula serius / orang awam</h6>
                                        <p className='mb-3 text-neutral-300'>Anda belum pernah menghasilkan satu rupiah pun dari internet?</p>
                                        <p className='text-neutral-300'>Program ini dirancang khusus untuk Anda yang ingin memulai dari nol, namun tidak ingin coba-coba. Kami berikan panduan teruji untuk mulai menghasilkan secara konsisten — tanpa terjebak trial and error.</p>
                                    </div>
                                </div>
                                <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                    <div className='h-full p-4 sm:p-8 xl:p-12 bg-neutral-950/85 rounded-3xl shadow-2xl shadow-black'>
                                        <div className='mb-2 inline-block bg-neutral-950 text-white rounded-full p-3'>
                                            <CameraIcon className='h-7 w-7' />
                                        </div>
                                        {/* <h6 className='font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300'>Kreator Konten yang Ingin Naik Kelas</h6> */}
                                        <h6 className='mb-6 font-semibold text-2xl text-white'>Kreator Konten yang Ingin Naik Kelas</h6>
                                        <p className='mb-3 text-neutral-300'>Sudah membangun audiens tapi belum tahu bagaimana cara konsisten menghasilkan uang dari mereka?</p>
                                        <p className='text-neutral-300'>Di sini, Anda akan belajar strategi konkret untuk memonetisasi konten Anda — bukan dengan cara musiman, tapi strategi jangka panjang.</p>
                                    </div>
                                </div>
                                <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                    <div className='h-full p-4 sm:p-8 xl:p-12 bg-neutral-950/85 rounded-3xl shadow-2xl shadow-black'>
                                        <div className='mb-2 inline-block bg-neutral-950 text-white rounded-full p-3'>
                                            <UsersRoundIcon className='h-7 w-7' />
                                        </div>
                                        {/* <h6 className='font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300'>Pendidik Digital & Ahli di Bidangnya</h6> */}
                                        <h6 className='mb-6 font-semibold text-2xl text-white'>Pendidik Digital & <br /> Ahli di Bidangnya</h6>
                                        <p className='text-neutral-300'>Anda punya keahlian dan ingin membantu banyak orang, tapi bingung cara mengubahnya menjadi penghasilan online yang konsisten Kami bantu Anda mengubah ilmu menjadi sistem digital yang bisa dijual berulang-ulang tanpa harus hadir setiap saat.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='relative z-10'>
                        <div className='bg-gradient-to-b from-transparent via-neutral-900 to-transparent'>
                            <div className='max-w-screen-md px-4 py-8 mx-auto text-center lg:py-24 lg:px-6'>
                                <h2 className="text-4xl lg:text-6xl tracking-tight font-semibold text-neutral-900 dark:text-white">Siap untuk melihat hasil seperti ini?</h2>
                                {/* <p className='sm:text-xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt atque in nisi, suscipit quis inventore ullam iusto deleniti recusandae corporis.</p> */}
                            </div>
                        </div>
                        <div className='py-12 max-w-screen-xl mx-auto grid grid-cols-3 gap-4'>
                            <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                <div className='h-full p-4 bg-neutral-900/85 rounded-3xl shadow-2xl shadow-black'>
                                    <img src="/img/testi1.webp" alt="testi1" className='aspect-[9/16] object-cover rounded-2xl' />
                                </div>
                            </div>
                            <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                <div className='h-full p-4 bg-neutral-900/85 rounded-3xl shadow-2xl shadow-black'>
                                    <img src="/img/testi2.webp" alt="testi2" className='aspect-[9/16] object-cover rounded-2xl' />
                                </div>
                            </div>
                            <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                <div className='h-full p-4 bg-neutral-900/85 rounded-3xl shadow-2xl shadow-black'>
                                    <img src="/img/testi3.webp" alt="testi3" className='aspect-[9/16] object-cover rounded-2xl' />
                                </div>
                            </div>
                        </div>
                        <div className="max-w-screen-xl mx-auto bg-gradient-to-r from-neutral-900 to-transparent rounded-3xl">
                            <div className="bg-gradient-to-tl from-neutral-500/10 from-[40%] to-[40%] to-transparent rounded-3xl">
                                <div className="bg-gradient-to-bl from-neutral-500/10 from-[30%] to-[30%] to-transparent rounded-3xl border border-neutral-800 p-6 lg:p-16 space-y-2">
                                    <h2 className="mb-8 text-4xl lg:text-6xl tracking-tight leading-snug font-medium text-white">Jual Produk Digitalmu Sekarang, <br /> Mulai dalam Hitungan Menit!</h2>
                                    <Link
                                        href='#'
                                        className="inline-block rounded-full px-6 py-3 text-xl leading-normal font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                                    >
                                        <CrownIcon className='inline h-4 w-4 md:me-2 md:mb-1' /><span className='hidden md:inline'>Mulai Sekarang</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* <div className="max-w-screen-xl mx-auto py-14 border border-white text-center mt-12">
                        disini 5 kolom foto testimoni
                    </div> */}

                    {/* <div className="max-w-screen-xl mx-auto py-14 border border-white text-center mt-12">
                        <h2>Mulai jualan digital produkmu sekarang</h2>
                        CTA 2
                    </div> */}

                    <section>
                        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                            <div className="max-w-screen-md mx-auto mb-8 lg:mb-16 text-center">
                                <h2 className="mb-4 text-4xl lg:text-6xl tracking-tight font-semibold text-neutral-900 dark:text-white">Video testimoni</h2>
                                {/* <p className="text-neutral-500 sm:text-xl dark:text-neutral-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit voluptatibus molestias accusantium vero perspiciatis ut!</p> */}
                            </div>
                            <div className="max-w-screen-xl mx-auto py-14 border border-white text-center mt-12">
                                disini 3 video testimoni
                            </div>
                        </div>
                    </section>

                    <section className='mb-12 max-w-screen-xl mx-auto px-4 sm:px-0'>
                        <div className="mb-8 lg:mb-16 text-center">
                            <h2 className="mb-4 text-4xl lg:text-6xl tracking-tight font-semibold text-neutral-900 dark:text-white">Apa yang kamu dapatkan?</h2>
                            <p className="text-neutral-500 sm:text-xl dark:text-neutral-400">Semua yang kamu inginkan ada di satu tempat</p>
                        </div>

                        <div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                    <div className='h-full p-4 sm:p-6 xl:p-12 flex flex-col bg-neutral-950/85 rounded-3xl shadow-2xl shadow-black'>
                                        <div className='flex-grow'>
                                            <div className='mb-4 inline-block bg-neutral-950 text-white rounded-full p-3'>
                                                <SparklesIcon className='h-7 w-7' />
                                            </div>
                                            <h6 className='mb-0 font-medium text-3xl text-white'>Akses semua ilmu sistematis</h6>
                                            <p className='mb-6 text-lg leading-8 text-neutral-300'>( modul video 20 lebih )</p>
                                            <p className='mb-6 text-neutral-300'>Blueprint 1 Miliar dari sultan giri panduan lengkap mulai dari dasar sampai jualan hingga strategi yang benar benar sudah terbukti (saya & member pakai).</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='text-nowrap bg-neutral-900 border rounded-full px-4 py-1 text-xl font-medium'>Rp. 1.000.000</div>
                                            <p>/ Bulan</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                    <div className='h-full p-4 sm:p-6 xl:p-12 flex flex-col bg-neutral-950/85 rounded-3xl shadow-2xl shadow-black'>
                                        <div className='flex-grow'>
                                            <div className='mb-4 inline-block bg-neutral-950 text-white rounded-full p-3'>
                                                <SparklesIcon className='h-7 w-7' />
                                            </div>
                                            <h6 className='mb-4 font-medium text-3xl text-white'>Live mentoring QNA session pakai zoom</h6>
                                            <p className='mb-6 text-lg leading-8 text-neutral-300'>Fasilitas live QNA dengan sultan giri CEO ternak income 2x kali kamu bisa tanya tentang konten,bisnis dan bisa minta bedah akunmu, dicari mana yang salah.</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='text-nowrap bg-neutral-900 border rounded-full px-4 py-1 text-xl font-medium'>Rp. 500.000</div>
                                            <p>/ Bulan</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                    <div className='h-full p-4 sm:p-6 xl:p-12 flex flex-col bg-neutral-950/85 rounded-3xl shadow-2xl shadow-black'>
                                        <div className='flex-grow'>
                                            <div className='mb-4 inline-block bg-neutral-950 text-white rounded-full p-3'>
                                                <SparklesIcon className='h-7 w-7' />
                                            </div>
                                            <h6 className='mb-4 font-medium text-3xl text-white'>Research, Trend & Study Case</h6>
                                            <p className='mb-6 text-lg leading-8 text-neutral-300'>Update trend terbaru yang punya potensi viral. laporan hasil riset tim ternak income dari mulai konten yang works dan cara jualan produk digital yang paling works.</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='text-nowrap bg-neutral-900 border rounded-full px-4 py-1 text-xl font-medium'>Rp. 250.000</div>
                                            <p>/ Bulan</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-gradient-to-br from-neutral-400 to-transparent to-50% rounded-3xl ps-[1px] pt-[1px]'>
                                    <div className='h-full p-4 sm:p-6 xl:p-12 flex flex-col bg-neutral-950/85 rounded-3xl shadow-2xl shadow-black'>
                                        <div className='flex-grow'>
                                            <div className='mb-4 inline-block bg-neutral-950 text-white rounded-full p-3'>
                                                <SparklesIcon className='h-7 w-7' />
                                            </div>
                                            <h6 className='mb-4 font-medium text-3xl text-white'>Akses grup premium</h6>
                                            <p className='mb-6 text-lg leading-8 text-neutral-300'>Disini kamu akan bergabung dengan member ternak income, diskusi atau tanya jawab, bahkan saling bantu promosi produk digital kamu bareng komunitas yang sama sama mau naik.</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='text-nowrap bg-neutral-900 border rounded-full px-4 py-1 text-xl font-medium'>Rp. 600.000</div>
                                            <p>/ Bulan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="max-w-screen-xl mx-auto bg-gradient-to-r from-neutral-900 to-transparent rounded-3xl">
                            <div className="bg-gradient-to-tl from-neutral-500/10 from-[40%] to-[40%] to-transparent rounded-3xl">
                                <div className="bg-gradient-to-bl from-neutral-500/10 from-[30%] to-[30%] to-transparent rounded-3xl border border-neutral-800 p-6 lg:p-16 space-y-2 text-center">
                                    <h2 className="mb-8 text-4xl lg:text-5xl tracking-tight leading-snug font-medium text-white">Jika ditotal, seluruh benefit eksklusif ini bernilai <br /> lebih dari <span className='py-1 font-semibold bg-neutral-800 border border-neutral-900 text-white px-4 rounded-full'>Rp. 2.350.000</span></h2>
                                    <div className='space-y-8'>
                                        <h2 className="text-xl md:text-3xl leading-snug text-white">
                                            Tapi khusus perdana launching <br /> kami berikan mulai <span className="py-1 font-semibold bg-neutral-800 border border-neutral-900 text-white px-4 rounded-full">Rp. 299.000</span> untuk akses belajar <span className="py-1 font-semibold bg-neutral-800 border border-neutral-900 text-white px-4 rounded-full">1 bulan penuh</span>
                                        </h2>
                                        <div className='flex justify-center items-center gap-8'>
                                            <div className='w-32 h-[1px] border-b border-neutral-600' />
                                            <div className='text-xl'>atau</div>
                                            <div className='w-32 h-[1px] border-b border-neutral-600' />
                                        </div>
                                        <h2 className="text-xl md:text-3xl leading-snug text-white">
                                            Paket kedua <span className="py-1 font-semibold bg-neutral-800 border border-neutral-900 text-white px-4 rounded-full">Rp. 399.000</span> untuk akses belajar <span className="py-1 font-semibold bg-neutral-800 border border-neutral-900 text-white px-4 rounded-full">3 bulan penuh</span>
                                        </h2>
                                        <div className='flex justify-center items-center gap-8'>
                                            <div className='w-32 h-[1px] border-b border-neutral-600' />
                                            <div className='text-xl'>atau</div>
                                            <div className='w-32 h-[1px] border-b border-neutral-600' />
                                        </div>
                                        <h2 className="mb-8 text-xl md:text-3xl leading-snug text-white">
                                            Langsung pilih paket terbaik <span className="py-1 font-semibold bg-neutral-800 border border-neutral-900 text-white px-4 rounded-full">Rp. 600.000</span> untuk akses <br /> <span className="py-1 font-semibold bg-neutral-800 border border-neutral-900 text-white px-4 rounded-full">seumur hidup</span> tanpa biaya bulanan!
                                        </h2>
                                        <div className='flex justify-center flex-col md:flex-row gap-2 mt-12'>
                                            <Link href="#pricing" className='inline-block text-nowrap bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-full px-8 py-2.5 text-xl font-semibold'>Beli 1 bulan</Link>
                                            <Link href="#pricing" className='inline-block text-nowrap bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-full px-8 py-2.5 text-xl font-semibold'>Beli 3 bulan</Link>
                                            <Link href="#pricing" className='inline-block text-nowrap bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-full px-8 py-2.5 text-xl font-semibold'>Beli selamanya</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                            <div className="max-w-screen-md mx-auto mb-8 lg:mb-16 text-center">
                                <h2 className="mb-4 text-4xl lg:text-6xl tracking-tight font-semibold text-neutral-900 dark:text-white">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h2>
                                <p className="text-neutral-500 sm:text-xl dark:text-neutral-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit voluptatibus molestias accusantium vero perspiciatis ut!</p>
                            </div>
                            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
                                <div className='bg-neutral-900/50 border border-neutral-800 rounded-3xl'>
                                    <img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="background" className='aspect-video w-full object-cover rounded-t-3xl' />
                                    <div className='p-4'>
                                        <h3 className="mb-2 text-xl font-bold dark:text-white">Lorem, ipsum dolor.</h3>
                                        <p className="mb-4 text-neutral-500 dark:text-neutral-400">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum.</p>
                                        <p className="text-neutral-500 dark:text-neutral-400"><span className='mr-2 px-3 py-1 rounded-full bg-neutral-900 border text-white'>16 Lessons</span> 2h 30m</p>
                                    </div>
                                </div>
                                <div className='bg-neutral-900/50 border border-neutral-800 rounded-3xl'>
                                    <img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="background" className='aspect-video w-full object-cover rounded-t-3xl' />
                                    <div className='p-4'>
                                        <h3 className="mb-2 text-xl font-bold dark:text-white">Lorem, ipsum dolor.</h3>
                                        <p className="mb-4 text-neutral-500 dark:text-neutral-400">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum.</p>
                                        <p className="text-neutral-500 dark:text-neutral-400"><span className='mr-2 px-3 py-1 rounded-full bg-neutral-900 border text-white'>16 Lessons</span> 2h 30m</p>
                                    </div>
                                </div>
                                <div className='bg-neutral-900/50 border border-neutral-800 rounded-3xl'>
                                    <img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="background" className='aspect-video w-full object-cover rounded-t-3xl' />
                                    <div className='p-4'>
                                        <h3 className="mb-2 text-xl font-bold dark:text-white">Lorem, ipsum dolor.</h3>
                                        <p className="mb-4 text-neutral-500 dark:text-neutral-400">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum.</p>
                                        <p className="text-neutral-500 dark:text-neutral-400"><span className='mr-2 px-3 py-1 rounded-full bg-neutral-900 border text-white'>16 Lessons</span> 2h 30m</p>
                                    </div>
                                </div>
                                <div className='bg-neutral-900/50 border border-neutral-800 rounded-3xl'>
                                    <img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="background" className='aspect-video w-full object-cover rounded-t-3xl' />
                                    <div className='p-4'>
                                        <h3 className="mb-2 text-xl font-bold dark:text-white">Lorem, ipsum dolor.</h3>
                                        <p className="mb-4 text-neutral-500 dark:text-neutral-400">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum.</p>
                                        <p className="text-neutral-500 dark:text-neutral-400"><span className='mr-2 px-3 py-1 rounded-full bg-neutral-900 border text-white'>16 Lessons</span> 2h 30m</p>
                                    </div>
                                </div>
                                <div className='bg-neutral-900/50 border border-neutral-800 rounded-3xl'>
                                    <img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="background" className='aspect-video w-full object-cover rounded-t-3xl' />
                                    <div className='p-4'>
                                        <h3 className="mb-2 text-xl font-bold dark:text-white">Lorem, ipsum dolor.</h3>
                                        <p className="mb-4 text-neutral-500 dark:text-neutral-400">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum.</p>
                                        <p className="text-neutral-500 dark:text-neutral-400"><span className='mr-2 px-3 py-1 rounded-full bg-neutral-900 border text-white'>16 Lessons</span> 2h 30m</p>
                                    </div>
                                </div>
                                <div className='bg-neutral-900/50 border border-neutral-800 rounded-3xl'>
                                    <img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="background" className='aspect-video w-full object-cover rounded-t-3xl' />
                                    <div className='p-4'>
                                        <h3 className="mb-2 text-xl font-bold dark:text-white">Lorem, ipsum dolor.</h3>
                                        <p className="mb-4 text-neutral-500 dark:text-neutral-400">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum.</p>
                                        <p className="text-neutral-500 dark:text-neutral-400"><span className='mr-2 px-3 py-1 rounded-full bg-neutral-900 border text-white'>16 Lessons</span> 2h 30m</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='bg-gradient-to-b from-transparent via-neutral-900 to-transparent p-6'>
                        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                            <div className="max-w-screen-md mx-auto text-center">
                                <h2 className="mb-8 text-5xl tracking-tight font-extrabold text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit?</h2>
                                <Link
                                    href='#'
                                    className="inline-block rounded-sm px-5 py-1.5 text-xl leading-normal font-medium bg-neutral-950 text-white"
                                >
                                    <CrownIcon className='inline h-4 w-4 md:me-2 md:mb-1' /><span className='hidden md:inline'>Gabung Sekarang</span>
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className='py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6'>
                        <div className='grid grid-cols-3 gap-4'>
                            {memberships.map((membership) => (
                                <CardPricing
                                    key={membership.id}
                                    label={membership.name}
                                    price={membership.price}
                                    description={membership.tagline || ''}
                                    priceDuration={membership.duration_days ? `${membership.duration_days} hari` : 'Selamanya'}
                                    features={membership.benefits?.map(benefit => ({ type: benefit.is_active ? 'check' : 'disabled', label: benefit.benefit })) || []}
                                />
                            ))}
                            {/* <CardPricing
                                label='Starter Plan'
                                price='299.000'
                                description='Cocok untuk kamu yang baru pertama mencoba.'
                                priceDuration='1 bulan'
                                features={[
                                    { type: "check", label: "Akses 1 bulan ke modul materi digital produk ternak income akademi." },
                                    { type: "check", label: "Belajar cara memilih niche produk digital yang paling cocok untukmu" },
                                    { type: "check", label: "Raih profitmu dengan cepat menggunakan strategi konten organik" },
                                    { type: "check", label: "Temukan cara membuat produk digital yang laku keras di pasaran" },
                                    { type: "disabled", label: "Coaching online" },
                                    { type: "check", label: "Bonus video penjualan yang menghasilkan 10+ juta lengkap dengan skripnya" },
                                    { type: "check", label: "1 produk digital yang bisa dijual ulang" },
                                    { type: "check", label: "Bonus strategi launching produk dan marketing" },
                                    { type: "disabled", label: "Bonus contoh promosi email yang menghasilkan 1 juta dalam 2 hari (study nyata)" },
                                    { type: "check", label: "Akses 1 bulan ke grup komunitas ternak income" }
                                ]}
                            />
                            <CardPricing
                                label='Pro Plan'
                                price='399.000'
                                description='Untuk kamu yang ingin scale up & serius jualan.'
                                priceDuration='3 bulan'
                                features={[
                                    { type: "check", label: "Akses 3 bulan ke modul materi digital produk ternak income akademi." },
                                    { type: "check", label: "Belajar cara memilih niche produk digital yang paling cocok untukmu" },
                                    { type: "check", label: "Raih profitmu dengan cepat menggunakan strategi konten organik" },
                                    { type: "check", label: "Temukan cara membuat produk digital yang laku keras di pasaran" },
                                    { type: "check", label: "Coaching online 2x dalam 3 bulan" },
                                    { type: "check", label: "Bonus video penjualan yang menghasilkan 10+ juta lengkap dengan skripnya" },
                                    { type: "check", label: "+5 produk digital yang bisa dijual ulang" },
                                    { type: "check", label: "Bonus strategi launching produk dan marketing" },
                                    { type: "check", label: "Bonus contoh promosi email yang menghasilkan 1 juta dalam 2 hari (study nyata)" },
                                    { type: "check", label: "Akses 3 bulan ke grup komunitas ternak income" }
                                ]}
                            />
                            <CardPricing
                                label='Lifetime Access'
                                price='600.000'
                                description='Bayar sekali dan dapat akses selamanya.'
                                priceDuration='selamanya'
                                features={[
                                    { type: "check", label: "Akses seumur hidup ke modul materi digital produk ternak income akademi" },
                                    { type: "check", label: "Belajar cara memilih niche produk digital yang paling cocok untukmu" },
                                    { type: "check", label: "Raih profitmu dengan cepat menggunakan strategi konten organik" },
                                    { type: "check", label: "Temukan cara membuat produk digital yang laku keras di pasaran" },
                                    { type: "check", label: "Coaching online 2 bulan sekali selama 1 tahun" },
                                    { type: "check", label: "Bonus video penjualan yang menghasilkan 10+ juta lengkap dengan skripnya" },
                                    { type: "check", label: "+5 produk digital yang bisa dijual ulang" },
                                    { type: "check", label: "Bonus strategi launching produk dan marketing" },
                                    { type: "check", label: "Bonus contoh promosi email yang menghasilkan 1 juta dalam 2 hari (study nyata)" },
                                    { type: "check", label: "Akses seumur hidup ke grup komunitas ternak income" }
                                ]}
                            /> */}
                        </div>
                    </section>

                    <div className="max-w-screen-md mx-auto mb-8 lg:mb-16 text-center">
                        <h2 className="mb-4 text-4xl lg:text-6xl tracking-tight font-semibold text-neutral-900 dark:text-white">Testimoni Member Ternak Income</h2>
                        <p className="text-neutral-500 sm:text-xl dark:text-neutral-400">Apa lagi yang kamu tunggu?</p>
                    </div>

                    <div className="max-w-screen-xl mx-auto py-14 border border-white text-center my-12">
                        foto testi banyak
                    </div>

                    <div className="max-w-screen-xl mx-auto py-14 border border-white text-center my-12">
                        <h6>gabung sekarang sebelum harga naik</h6>
                        <p>Pilih paketmu</p>
                        <Button>Starter plan</Button>
                        <p>1 bulan</p>
                        <Button>pro plan</Button>
                        <p>3 bulan</p>
                        <Button>lifetime plan</Button>
                        <p>Seumur hidup</p>
                    </div>

                    <section>
                        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                            <div className='text-center'>
                                <h2 className="mb-8 tracking-tight font-extrabold text-neutral-900 dark:text-white">Ternak Income by Sultan Giri</h2>
                                <p className='mb-4 text-4xl'>Digital produk adalah bisnis yang sangat gampang untuk dibuat dan sedang hype</p>
                                <Button size={'lg'}>Jangan sampai ketinggalan</Button>
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </>
    );
}
