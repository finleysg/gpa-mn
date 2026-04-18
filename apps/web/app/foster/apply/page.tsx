import { redirect } from "next/navigation"
import { getFosterApplicationFromCookie } from "./_actions/application"
import { MagicLinkForm } from "./_components/magic-link-form"

export default async function ApplyPage() {
    const application = await getFosterApplicationFromCookie()
    if (application) {
        if (application.status !== "draft") {
            redirect("/foster/apply/status")
        }
        redirect("/foster/apply/wizard")
    }

    return (
        <div className="flex flex-1 items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="font-heading text-4xl tracking-wide">
                        Start Your Foster Application
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Enter your information below and we&apos;ll send you a secure link to access
                        your application. You can save your progress and return anytime.
                    </p>
                </div>
                <MagicLinkForm />
            </div>
        </div>
    )
}
