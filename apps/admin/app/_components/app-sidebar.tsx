"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    AlertTriangle,
    BookOpen,
    Calendar,
    ChevronsUpDown,
    ChevronRight,
    FileText,
    HandCoins,
    Heart,
    Home,
    LogOut,
    Mail,
    PawPrint,
    Settings,
    Users,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import { useSession } from "./session-provider"
import { authClient } from "@/app/lib/auth-client"
import { useRouter } from "next/navigation"
import { type RoleName } from "@repo/database"

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

type NavEntry = (NavItem | NavGroup) & { section?: string }

function isGroup(entry: NavEntry): entry is NavGroup & { section?: string } {
    return "children" in entry
}

function isActive(pathname: string, entry: NavEntry): boolean {
    if (isGroup(entry)) {
        return entry.children.some((c) => isActive(pathname, c))
    }
    return pathname.startsWith(entry.href)
}

const SECTION_ACCESS: Record<string, RoleName[]> = {
    users: ["Super Admin", "User Admin"],
    home: ["Super Admin", "Content Admin"],
    adopt: [
        "Super Admin",
        "Content Admin",
        "Adoption Matcher",
        "Adoption Coordinator",
        "Adoption Rep",
        "Adoption Observer",
    ],
    volunteer: ["Super Admin", "Content Admin"],
    donate: ["Super Admin", "Content Admin"],
    events: ["Super Admin", "Content Admin"],
    about: ["Super Admin", "Content Admin"],
    "lost-hound": ["Super Admin", "Content Admin"],
    foster: ["Super Admin", "Foster Coordinator", "Foster"],
}

function canAccess(roles: RoleName[], section?: string): boolean {
    if (!section) return true
    if (roles.includes("Super Admin")) return true
    const allowed = SECTION_ACCESS[section]
    if (!allowed) return false
    return roles.some((r) => allowed.includes(r))
}

const adminEntries: NavEntry[] = [
    { title: "All Users", href: "/users", icon: Users, section: "users" },
    { title: "Invitations", href: "/users/invitations", icon: Mail, section: "users" },
]

const navEntries: NavEntry[] = [
    {
        title: "Home",
        icon: Home,
        section: "home",
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
        section: "adopt",
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
            { title: "Pages", href: "/adopt-pages", icon: FileText },
        ],
    },
    {
        title: "Volunteer",
        icon: Heart,
        section: "volunteer",
        children: [
            { title: "Page Header", href: "/content/page-header/volunteer" },
            { title: "Fostering", href: "/content/section-header/volunteer-fostering" },
            { title: "Roles Header", href: "/content/section-header/volunteer-roles" },
            { title: "Volunteer Role Cards", href: "/volunteer-roles" },
            { title: "Pages", href: "/volunteer-pages", icon: FileText },
        ],
    },
    {
        title: "Donate",
        icon: HandCoins,
        section: "donate",
        children: [
            { title: "Page Header", href: "/content/page-header/donate" },
            { title: "Ways to Give", href: "/content/section-header/donate-ways" },
            { title: "Donation Options", href: "/donation-options" },
            { title: "Pages", href: "/donate-pages", icon: FileText },
        ],
    },
    { title: "Events", href: "/events", icon: Calendar, section: "events" },
    {
        title: "About",
        icon: BookOpen,
        section: "about",
        children: [
            { title: "Page Header", href: "/content/page-header/about" },
            { title: "About Page", href: "/about-page" },
            { title: "Learn More", href: "/content/section-header/about-explore" },
        ],
    },
    {
        title: "Lost Hound",
        icon: AlertTriangle,
        section: "lost-hound",
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
    const router = useRouter()
    const { user, roles } = useSession()

    async function handleSignOut() {
        await authClient.signOut()
        router.push("/login")
    }

    const visibleContentEntries = navEntries.filter((entry) => canAccess(roles, entry.section))
    const visibleAdminEntries = adminEntries.filter((entry) => canAccess(roles, entry.section))

    function renderEntries(entries: NavEntry[]) {
        return entries.map((entry) =>
            isGroup(entry) ? (
                <NavGroupItem key={entry.title} group={entry} pathname={pathname} />
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
        )
    }

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
                        <SidebarMenu>{renderEntries(visibleContentEntries)}</SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {visibleAdminEntries.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Users</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>{renderEntries(visibleAdminEntries)}</SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <span className="truncate">{user.name}</span>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-56">
                                <div className="text-muted-foreground px-2 py-1.5 text-sm">
                                    {user.email}
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/account">
                                        <Settings className="mr-2 size-4" />
                                        Account Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 size-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
