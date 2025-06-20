import { create } from 'zustand';

type LogoutDialogStore = {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
};

export const useLogoutDialogStore = create<LogoutDialogStore>((set) => ({
    isOpen: false,
    setOpen: (open) => set({ isOpen: open }),
}));