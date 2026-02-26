import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/shared/ProfileForm"

export default async function AdminSettingsPage() {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) redirect("/login")

    return (
        <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
            <div className="mb-6">
                <a href="/admin" className="text-pink-400 hover:underline">← Zurück zum Dashboard</a>
            </div>
            <h1 className="text-3xl font-serif font-bold mb-8 text-center text-white">Admin Profil Einstellungen</h1>
            <div className="bg-neutral-900 p-8 rounded shadow-lg max-w-lg mx-auto border border-neutral-800">
                <ProfileForm user={user} />
            </div>
        </div>
    )
}
