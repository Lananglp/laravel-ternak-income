import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CrownIcon, Folder, HashIcon, KeyIcon, LayoutGrid, MessageSquareTextIcon, Package2, PencilRulerIcon, ReceiptTextIcon, StarsIcon, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {

    const { auth } = usePage<SharedData>().props;

    const isActive = auth.user.membership_expires_at && new Date(auth.user.membership_expires_at) > new Date();

    const mainNavItems: NavItem[] = [
        ...(auth.user.role?.slug === 'admin'
            ? [
                {
                    title: 'Pembayaran',
                    href: '/transactions',
                    icon: ReceiptTextIcon,
                },
                {
                    title: 'Pengguna Akun',
                    href: '/accounts',
                    icon: UsersRound,
                },
                {
                    title: 'Roles',
                    href: '/roles',
                    icon: KeyIcon,
                },
            ]
            : []),
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Modul',
            href: '/modules',
            icon: Package2,
        },
        {
            title: 'Membership',
            href: '/membership',
            icon: CrownIcon,
        },
    ];

    const footerNavItems: NavItem[] = [
        ...(auth.user.role?.slug === 'user'
            ? [
                {
                    title: isActive ? auth.user.membership ? auth.user.membership?.name : 'Terjadi Kesalahan' : 'Free Plan',
                    href: '/membership/info',
                    icon: StarsIcon,
                },
            ]
            : []),
        {
            title: 'Hubungi Kami',
            href: '/contacts',
            icon: MessageSquareTextIcon,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
