import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    flash: {
        success?: string;
        error?: string;
        status?: string;
        snap_token?: string;
    }
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    provider: 'none' | 'google';
    bio: string | null;
    phone: string | null;
    url: string | null;
    username_changed_at: string | null;
    role: Role | null;
    membership_id: number | null;
    membership: Membership | null;
    membership_started_at: string | null;
    membership_expires_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Membership {
    id: number;
    name: string;
    price: number;
    duration_days: number | null;
    tagline?: string | null;
    position: number;
    benefits?: MembershipBenefit[];
    // created_at: string;
    // updated_at: string;
}

export interface MembershipBenefit {
  id: number;
  membership_id: number;
  benefit: string;
  is_active: boolean;
  position: number;
};

export interface Transaction {
    id: number;
    user_id: number;
    user: User;
    membership_id: number;
    membership: Membership;
    order_id: number;
    payment_type: string | null;
    transaction_status: string | null;
    transaction_id: string | null;
    fraud_status: string | null;
    response: json | null;
    paid_at: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface Module {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    position: number;
    videos_count: number;
    created_at: string | null;
    updated_at: string | null;
}