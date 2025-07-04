import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CrownIcon, Folder, HashIcon, KeyIcon, LayoutGrid, MessageSquareTextIcon, Package2, PencilRulerIcon, ReceiptTextIcon, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {

    const { auth } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        ...(auth.user.role?.slug === 'user'
            ? [
                {
                    title: 'Membership Info',
                    href: '/membership/info',
                    icon: CrownIcon,
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
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Membership Info',
            href: '/membership/info',
            icon: CrownIcon,
        },
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
