import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Role } from "@/types";
import { router } from "@inertiajs/react";
import { LoaderCircle, TrashIcon } from "lucide-react";
import { useState } from "react";

export const RoleDelete = ({ role }: { role: Role }) => {

    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDeleteAccount = () => {
        setProcessing(true);
        router.delete(route('role.destroy', role.id), {
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
                    <Button title={`Delete ${role.name}`} type="button" variant="destructive" size={'iconSm'}><TrashIcon /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this role?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. The role with the name <strong className="text-black dark:text-white">{role.name}</strong> will be deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" disabled={processing} onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" disabled={processing} onClick={handleDeleteAccount}>
                            {processing && <LoaderCircle className="animate-spin" />}
                            Delete Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RoleDelete;