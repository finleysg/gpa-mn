'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, FileText, Heart, PawPrint, Users } from 'lucide-react';
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
} from '@repo/ui/components/sidebar';

const navItems = [
  { title: 'Events', href: '/events', icon: Calendar },
  { title: 'Section Headers', href: '/section-headers', icon: FileText },
  { title: 'Adoption Steps', href: '/adoption-steps', icon: PawPrint },
  { title: 'Volunteer Roles', href: '/volunteer-roles', icon: Users },
  { title: 'Donation Options', href: '/donation-options', icon: Heart },
];

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
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
