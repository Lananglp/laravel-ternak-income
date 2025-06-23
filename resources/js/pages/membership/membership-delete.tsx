import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Membership } from "@/types";
import { router } from "@inertiajs/react";
import { LoaderCircle, TrashIcon } from "lucide-react";
import { useState } from "react";

export const MembershipDelete = ({ membership }: { membership: Membership }) => {

    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(route('membership.destroy', membership.id), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setOpen(false);
                // Optionally handle success, e.g., show a notification or redirect
            }
        });
    }

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
                    <Button title={`Hapus ${membership.name}`} type="button" variant="destructive" size={'iconXs'} className='rounded-full'><TrashIcon /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yakin menghapus membership ini?</DialogTitle>
                        <DialogDescription>
                            Aksi ini tidak dapat dibatalkan. Membership <strong className="text-black dark:text-white">{membership.name}</strong> akan dihapus secara permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" disabled={processing} onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" disabled={processing} onClick={handleDelete}>
                            {processing && <LoaderCircle className="animate-spin" />}
                            Hapus 
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MembershipDelete;