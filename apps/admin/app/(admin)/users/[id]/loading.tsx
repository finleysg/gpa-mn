import { Skeleton } from "@repo/ui/components/skeleton"

export default function Loading() {
    return (
        <div>
            <Skeleton className="mb-6 h-8 w-32" />
            <div className="max-w-md space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                        <Skeleton className="mb-1 h-4 w-16" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                ))}
            </div>
        </div>
    )
}
