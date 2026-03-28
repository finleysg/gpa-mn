export type NavItem = {
    label: string
    href: string
    children?: NavItem[]
}

export const mainNav: NavItem[] = [
    {
        label: "Adopt",
        href: "/adopt",
        children: [
            { label: "Available Dogs", href: "/adopt/available" },
            { label: "Our Process", href: "/adopt/our-process" },
            { label: "Post-Adoption Support", href: "/adopt/support" },
            { label: "Why GPA-MN?", href: "/adopt/why-gpa-mn" },
        ],
    },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Donate", href: "/donate" },
    { label: "Events", href: "/events" },
    {
        label: "About",
        href: "/about",
        children: [
            { label: "History", href: "/about/history" },
            { label: "Contact", href: "/about/contact" },
        ],
    },
    { label: "Lost Hound!", href: "/lost-hound" },
]

export const footerNav = {
    quickLinks: [
        { label: "Adopt", href: "/adopt" },
        { label: "Available Dogs", href: "/adopt/available" },
        { label: "Donate", href: "/donate" },
        { label: "Volunteer", href: "/volunteer" },
        { label: "Events", href: "/events" },
    ],
    resources: [
        { label: "Our Process", href: "/adopt/our-process" },
        { label: "Post-Adoption Support", href: "/adopt/support" },
        { label: "About Us", href: "/about" },
        { label: "History", href: "/about/history" },
        { label: "Why GPA-MN?", href: "/adopt/why-gpa-mn" },
        { label: "Lost Hound!", href: "/lost-hound" },
    ],
}
