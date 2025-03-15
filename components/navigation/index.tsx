import { Role } from "@/models/api";
import { createNavigation } from 'next-intl/navigation';

export type NavItem = {
    href: string;
    label?: string;
    roles: Role[];
};

export type Route = {
    href: string;
    roles: Role[];
};


export const { Link, redirect, usePathname, useRouter } = createNavigation();
