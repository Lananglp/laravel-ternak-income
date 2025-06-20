import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/types";
import { router } from "@inertiajs/react";
import { LoaderCircle, TrashIcon } from "lucide-react";
import { useState } from "react";

export const AccountDelete = ({ user }: { user: User }) => {

    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDeleteAccount = () => {
        setProcessing(true);
        router.delete(route('account.destroy', user.id), {
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
                    <Button title={`Delete ${user.name}`} type="button" variant="destructive" size={'iconSm'}><TrashIcon /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this account?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. The account with the name <strong className="text-black dark:text-white">{user.name}</strong> will be deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" disabled={processing} onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" disabled={processing} onClick={handleDeleteAccount}>
                            {processing && <LoaderCircle className="animate-spin" />}
                            Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AccountDelete;