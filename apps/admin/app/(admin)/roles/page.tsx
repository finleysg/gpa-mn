import { getRoles } from "@repo/database"
import { requireSectionAccess } from "@/app/_lib/require-section-access"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/components/table"
import { WebsiteVisibleToggle } from "./_components/website-visible-toggle"

export default async function RolesPage() {
    await requireSectionAccess("users")
    const roles = await getRoles()

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">Roles</h1>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Website Visible</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.id}>
                            <TableCell className="font-medium">{role.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {role.description || "—"}
                            </TableCell>
                            <TableCell>
                                <WebsiteVisibleToggle
                                    roleId={role.id}
                                    currentValue={role.websiteVisible}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
