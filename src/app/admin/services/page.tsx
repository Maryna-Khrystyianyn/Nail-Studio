import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getServices } from "@/lib/service-actions"
import { ServiceManager } from "@/components/admin/ServiceManager"
import Link from "next/link"

export default async function AdminServicesPage() {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') redirect("/")

    const services = await getServices()

    return (
        <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="text-neutral-400 hover:text-white transition">← Zurück</Link>
                <h1 className="text-3xl font-serif font-bold text-pink-600">Leistungen bearbeiten</h1>
            </div>

            <ServiceManager services={services} />
        </div>
    )
}
