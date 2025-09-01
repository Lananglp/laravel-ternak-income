import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Module, ModuleVideo } from "@/types";
import { router } from "@inertiajs/react";
import { LoaderCircle, TrashIcon } from "lucide-react";
import { useState } from "react";

export const ModuleVideoDelete = ({ slug, videos }: { slug: string, videos: ModuleVideo }) => {

    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(route("module.video.destroy", { slug: slug, id: videos.id }), {
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
                    <Button title={`Hapus video`} type="button" variant="destructive" size={'iconXs'} className="rounded-full"><TrashIcon /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yakin menghapus video ini?</DialogTitle>
                        <DialogDescription>
                            Aksi ini tidak dapat dibatalkan. video <strong className="text-black dark:text-white">{videos.title}</strong> akan dihapus secara permanen.
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

export default ModuleVideoDelete;