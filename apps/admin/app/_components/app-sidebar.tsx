'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  ChevronRight,
  FileText,
  Home,
  LayoutGrid,
  PawPrint,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@repo/ui/components/sidebar';

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return 'children' in entry;
}

const navEntries: NavEntry[] = [
  { title: 'Home', href: '/home', icon: Home },
  { title: 'Events', href: '/events', icon: Calendar },
  {
    title: 'Pages',
    icon: FileText,
    children: [
      { title: 'Page Headers', href: '/page-headers' },
      { title: 'Section Headers', href: '/section-headers' },
      { title: 'About Page', href: '/about-page' },
      { title: 'Before You Apply', href: '/before-you-apply' },
    ],
  },
  {
    title: 'Adoption',
    icon: PawPrint,
    children: [
      { title: 'Adoption Steps', href: '/adoption-steps' },
      { title: 'Volunteer Roles', href: '/volunteer-roles' },
    ],
  },
  {
    title: 'Card Lists',
    icon: LayoutGrid,
    children: [
      { title: 'Donation Options', href: '/donation-options' },
      { title: 'Post Adoption Support', href: '/post-adoption-support' },
      { title: 'Suggestions', href: '/lost-hound-suggestions' },
      { title: 'Why Greyhounds', href: '/why-greyhounds' },
    ],
  },
];

function NavGroupItem({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  const isChildActive = group.children.some((c) => pathname.startsWith(c.href));
  const [open, setOpen] = useState(isChildActive);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={() => setOpen(!open)} isActive={isChildActive}>
        <group.icon />
        <span>{group.title}</span>
        <ChevronRight
          className={`ml-auto size-4 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </SidebarMenuButton>
      {open && (
        <SidebarMenuSub>
          {group.children.map((child) => (
            <SidebarMenuSubItem key={child.href}>
              <SidebarMenuSubButton asChild isActive={pathname.startsWith(child.href)}>
                <Link href={child.href}>{child.title}</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link href="/" className="font-heading text-xl">
          GPA-MN Admin
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navEntries.map((entry) =>
                isGroup(entry) ? (
                  <NavGroupItem
                    key={entry.title}
                    group={entry}
                    pathname={pathname}
                  />
                ) : (
                  <SidebarMenuItem key={entry.href}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(entry.href)}>
                      <Link href={entry.href}>
                        {entry.icon && <entry.icon />}
                        <span>{entry.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
