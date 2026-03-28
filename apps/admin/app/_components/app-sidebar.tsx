"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    AlertTriangle,
    BookOpen,
    Calendar,
    ChevronRight,
    HandCoins,
    Heart,
    Home,
    PawPrint,
} from "lucide-react"
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
} from "@repo/ui/components/sidebar"

interface NavItem {
    title: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
}

interface NavGroup {
    title: string
    icon?: React.ComponentType<{ className?: string }>
    children: NavEntry[]
}

type NavEntry = NavItem | NavGroup

function isGroup(entry: NavEntry): entry is NavGroup {
    return "children" in entry
}

function isActive(pathname: string, entry: NavEntry): boolean {
    if (isGroup(entry)) {
        return entry.children.some((c) => isActive(pathname, c))
    }
    return pathname.startsWith(entry.href)
}

const navEntries: NavEntry[] = [
    {
        title: "Home",
        icon: Home,
        children: [
            { title: "Page Header", href: "/home" },
            { title: "Available Greyhounds", href: "/content/section-header/home-adopt" },
            { title: "Events", href: "/content/section-header/home-events" },
            { title: "Volunteer", href: "/content/section-header/home-volunteer" },
        ],
    },
    {
        title: "Adopt",
        icon: PawPrint,
        children: [
            { title: "Page Header", href: "/content/page-header/adopt" },
            { title: "Why Greyhounds", href: "/content/section-header/adopt-why" },
            { title: "Why Greyhounds Cards", href: "/why-greyhounds" },
            { title: "Get Started", href: "/content/section-header/adopt-get-started" },
            {
                title: "Why GPA-MN",
                children: [
                    { title: "Page Header", href: "/content/page-header/adopt-why-gpa-mn" },
                    { title: "Why Choose Us Content", href: "/why-choose-us" },
                ],
            },
            {
                title: "Our Process",
                children: [
                    { title: "Page Header", href: "/content/page-header/adopt-process" },
                    { title: "Steps Header", href: "/content/section-header/adopt-process-steps" },
                    { title: "Adoption Steps List", href: "/adoption-steps" },
                    { title: "Before You Apply", href: "/before-you-apply" },
                ],
            },
            {
                title: "Support",
                children: [
                    { title: "Page Header", href: "/content/page-header/adopt-support" },
                    {
                        title: "Resources Header",
                        href: "/content/section-header/adopt-support-resources",
                    },
                    { title: "Support Resources Cards", href: "/post-adoption-support" },
                ],
            },
        ],
    },
    {
        title: "Volunteer",
        icon: Heart,
        children: [
            { title: "Page Header", href: "/content/page-header/volunteer" },
            { title: "Fostering", href: "/content/section-header/volunteer-fostering" },
            { title: "Roles Header", href: "/content/section-header/volunteer-roles" },
            { title: "Volunteer Role Cards", href: "/volunteer-roles" },
        ],
    },
    {
        title: "Donate",
        icon: HandCoins,
        children: [
            { title: "Page Header", href: "/content/page-header/donate" },
            { title: "Ways to Give", href: "/content/section-header/donate-ways" },
            { title: "Donation Options", href: "/donation-options" },
        ],
    },
    { title: "Events", href: "/events", icon: Calendar },
    {
        title: "About",
        icon: BookOpen,
        children: [
            { title: "Page Header", href: "/content/page-header/about" },
            { title: "About Page", href: "/about-page" },
            { title: "Learn More", href: "/content/section-header/about-explore" },
        ],
    },
    {
        title: "Lost Hound",
        icon: AlertTriangle,
        children: [
            { title: "Page Header", href: "/content/page-header/lost-hound" },
            { title: "Act Now Lists", href: "/content/section-header/lost-hound-act" },
            { title: "Prevention Header", href: "/content/section-header/lost-hound-prevention" },
            { title: "Prevention Suggestions", href: "/lost-hound-suggestions" },
        ],
    },
]

function NavSubGroup({ group, pathname }: { group: NavGroup; pathname: string }) {
    const childActive = isActive(pathname, group)
    const [open, setOpen] = useState(childActive)

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                onClick={() => setOpen(!open)}
                className="cursor-pointer"
                isActive={childActive}
            >
                <span>{group.title}</span>
                <ChevronRight
                    className={`ml-auto size-3 transition-transform ${open ? "rotate-90" : ""}`}
                />
            </SidebarMenuSubButton>
            {open && (
                <SidebarMenuSub>
                    {group.children.map((child) =>
                        isGroup(child) ? (
                            <NavSubGroup key={child.title} group={child} pathname={pathname} />
                        ) : (
                            <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname.startsWith(child.href)}
                                >
                                    <Link href={child.href}>{child.title}</Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ),
                    )}
                </SidebarMenuSub>
            )}
        </SidebarMenuSubItem>
    )
}

function NavGroupItem({ group, pathname }: { group: NavGroup; pathname: string }) {
    const childActive = isActive(pathname, group)
    const [open, setOpen] = useState(childActive)

    return (
        <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setOpen(!open)} isActive={childActive}>
                {group.icon && <group.icon />}
                <span>{group.title}</span>
                <ChevronRight
                    className={`ml-auto size-4 transition-transform ${open ? "rotate-90" : ""}`}
                />
            </SidebarMenuButton>
            {open && (
                <SidebarMenuSub>
                    {group.children.map((child) =>
                        isGroup(child) ? (
                            <NavSubGroup key={child.title} group={child} pathname={pathname} />
                        ) : (
                            <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname.startsWith(child.href)}
                                >
                                    <Link href={child.href}>{child.title}</Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ),
                    )}
                </SidebarMenuSub>
            )}
        </SidebarMenuItem>
    )
}

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader className="border-b px-4 py-3">
                <Link href="/">
                    <img
                        src="/images/gpa-logo-light.png"
                        alt="GPA‑MN Admin"
                        className="h-9 w-auto"
                    />
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
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname.startsWith(entry.href)}
                                        >
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
    )
}
