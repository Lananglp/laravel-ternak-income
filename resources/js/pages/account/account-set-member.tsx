import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Membership } from '@/types';
import { CrownIcon, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { formatRupiah } from '@/helper/helper';

type ComponentForm = {
    membership_id: number | null;
};

export const SetUserToMember = ({
    user,
    memberships,
    isActive,
}: {
    user: User;
    memberships: Membership[];
    isActive: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const { data, setData, put, errors, setError, clearErrors, reset, processing, recentlySuccessful } = useForm<Required<ComponentForm>>({
        membership_id: user.membership_id || null,
    });

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('account.set-member', user.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                handleClose();
                router.get(route('account.index'), {}, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['accounts']
                });
            },
        });
    };

    const handleChange = (id: number) => {
        if (!processing) {
            setData('membership_id', id);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!processing) {
                    if (nextOpen) {
                        // Reset ke membership_id terbaru dari user
                        setData('membership_id', user.membership_id ?? null);
                        setOpen(true);
                    } else {
                        handleClose();
                    }
                }
            }}
        >
            <DialogTrigger asChild>
                <Button
                    title={`Ubah ${user.name} menjadi member`}
                    type="button"
                    variant="outline"
                    size={'iconSm'}
                >
                    <CrownIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[96dvh] overflow-y-auto'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <DialogHeader>
                        <DialogTitle>Aktivasi Manual Member</DialogTitle>
                        <DialogDescription>
                            Anda dapat aktivasi membership kepada <strong className="font-medium text-black dark:text-white">{user.name}</strong> menjadi member aktif dengan memilih daftar membership dibawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='grid grid-cols-1 gap-2'>
                        {memberships && memberships.length > 0 ? memberships.map((membership, index) => (
                            <div onClick={() => handleChange(membership.id)} key={index} className={`relative rounded-xl bg-gradient-to-r from-neutral-900 to-transparent hover:to-neutral-900 border border-neutral-800 ${isActive ? data.membership_id === membership.id ? 'border-purple-500 bg-neutral-900' : 'hover:border-purple-500/50' : data.membership_id === membership.id ? 'border-purple-500' : 'hover:border-purple-500/50'} hover:cursor-pointer p-4 transition-colors duration-100 ${isActive && membership.id === user.membership_id ? 'mt-2' : ''}`}>
                                {isActive && membership.id === user.membership_id && 
                                    <div className={`absolute -top-2.5 right-3 ${data.membership_id === membership.id ? 'bg-purple-800' : 'bg-neutral-800'} text-white font-medium rounded-full text-sm px-3`}>Sedang aktif</div>
                                }
                                <div className='flex justify-between items-center gap-2'>
                                    <h6 className='font-medium text-white line-clamp-1'>{membership.name}</h6>
                                    <p className='text-sm font-medium tracking-wide text-nowrap'>{formatRupiah(membership.price)}</p>
                                </div>
                                <div className='flex justify-between items-center gap-2'>
                                    <p className='text-sm line-clamp-1 text-neutral-400'>{membership.tagline}</p>
                                    <p className='text-sm'>{membership.duration_days} Hari</p>
                                </div>
                            </div>
                        )) : (
                            <div className='px-6 py-12 border border-neutral-900 rounded-xl text-sm text-neutral-500 text-center'>
                                <h6 className='text-lg font-medium'>Data membership kosong</h6>
                                <p>Silahkan tambahkan terlebih dahulu melalui menu membership</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-neutral-400">
                            Dengan mengubah status membership pengguna, pengguna akan langsung menjadi member secara otomatis tanpa dikenakan biaya apa pun.
                        </p>
                        <p className="text-sm text-neutral-400">
                            Durasi keanggotaan yang baru tidak akan ditambahkan ke durasi sebelumnya, melainkan akan digantikan oleh durasi dari membership yang dipilih.
                        </p>
                        <p className="text-sm text-neutral-400">
                            Perubahan ini bersifat permanen dan tidak dapat dibatalkan. Pastikan Anda benar-benar yakin sebelum melanjutkan perubahan.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Batalkan
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="animate-spin mr-2" />}
                            Simpan Perubahaan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SetUserToMember;