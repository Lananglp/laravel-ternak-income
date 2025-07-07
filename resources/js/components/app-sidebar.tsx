import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CrownIcon, Folder, HashIcon, KeyIcon, LayoutGrid, MailIcon, MessageSquareTextIcon, Package2, PencilRulerIcon, ReceiptTextIcon, StarsIcon, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';
import { Badge } from './ui/badge';

export function AppSidebar() {

    const { auth, unreadContactsCount } = usePage<SharedData>().props;

    const isActive = auth.user.membership_expires_at && new Date(auth.user.membership_expires_at) > new Date();
    const isAdmin = auth.user.role?.slug === 'admin';
    const isUser = auth.user.role?.slug === 'user';

    const mainNavItems: NavItem[] = [
        ...(isAdmin ? 
            [
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                    icon: LayoutGrid,
                },
            ] : []),
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
        ...(isAdmin ? 
            [
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
                {
                    title: 'Laporan Pengguna',
                    href: '/contact',
                    icon: MailIcon,
                    badge:
                        unreadContactsCount > 0 ? (
                            <span className='inline-block text-xs bg-red-800 text-white rounded h-4 px-1 min-w-4 ms-1'>1</span>
                        ) : null,
                },
            ] : []),
    ];

    const footerNavItems: NavItem[] = [
        ...(isUser ?
            [
                {
                    title: isActive ? auth.user.membership ? auth.user.membership?.name : 'Terjadi Kesalahan' : 'Free Plan',
                    href: '/membership/info',
                    icon: StarsIcon,
                },
                {
                    title: 'Hubungi Kami',
                    href: '/contact-us',
                    icon: MessageSquareTextIcon,
                },
            ] : []),
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
