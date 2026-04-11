import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Adoption Application | GPA-MN",
    description: "Apply to adopt a retired racing greyhound from GPA-MN.",
}

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b py-4">
                <div className="container mx-auto flex items-center px-4">
                    <Link href="/" className="font-heading text-2xl tracking-wide">
                        GPA-MN
                    </Link>
                    <span className="text-muted-foreground ml-3 text-sm">Adoption Application</span>
                </div>
            </header>
            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    )
}
