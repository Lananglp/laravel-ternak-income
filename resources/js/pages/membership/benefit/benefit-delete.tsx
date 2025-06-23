import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { MembershipBenefit } from "@/types";
import { router } from "@inertiajs/react";
import { LoaderCircle, TrashIcon } from "lucide-react";
import { useState } from "react";

export const BenefitDelete = ({ membershipId, benefit }: { membershipId: number, benefit: MembershipBenefit }) => {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(route('benefits.destroy', [membershipId, benefit.id]), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setOpen(false);
            }
        });
    };

    return (
        <div>
            <Dialog
                open={open}
                onOpenChange={(nextOpen) => {
                    if (!processing) {
                        if (nextOpen) setOpen(true);
                        else setOpen(false);
                    }
                }}
            >
                <DialogTrigger asChild>
                    <Button
                        title={`Hapus benefit: ${benefit.benefit}`}
                        type="button"
                        variant="destructive"
                        size={'iconXs'}
                        className='rounded-full'
                    >
                        <TrashIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yakin menghapus benefit ini?</DialogTitle>
                        <DialogDescription>
                            Aksi ini tidak dapat dibatalkan. Benefit <strong className="text-black dark:text-white">{benefit.benefit}</strong> akan dihapus secara permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" disabled={processing} onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" disabled={processing} onClick={handleDelete}>
                            {processing && <LoaderCircle className="animate-spin me-2 h-4 w-4" />}
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BenefitDelete;
