import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { useLogoutDialogStore } from '@/stores/use-logout-dialog-store';

interface UserMenuContentProps {
    user: User;
    onClose?: () => void;
}

export function UserMenuContent({ user, onClose }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { setOpen } = useLogoutDialogStore();

    const handleLogout = () => {
        cleanup();
        setOpen(true);
        onClose?.();
        // router.post(route('logout'));
        // router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="size-4 mr-2" />
                Log out
            </DropdownMenuItem>
        </>
    );
}
