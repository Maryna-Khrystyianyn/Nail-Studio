import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminAppointmentItem } from "@/components/admin/AdminAppointmentItem"
import { AdminHeroImageForm } from "@/components/admin/AdminHeroImageForm"
import Link from "next/link"

// Simple price map for estimation (should ideally be in DB)
const PRICE_MAP: Record<string, number> = {
    'Klassische Maniküre (25 €)': 25,
    'Gel Maniküre (45 €)': 45,
    'Acryl Neumodellage (60 €)': 60,
    'Klassische Pediküre (35 €)': 35,
}

export default async function AdminPage() {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
        redirect("/")
    }

    // Fetch Stats
    const pendingCount = await prisma.appointment.count({
        where: { status: 'PENDING' }
    })

    const userCount = await prisma.user.count({
        where: { role: 'USER' }
    })

    // Calculate revenue (approximate based on COMPLETED or CONFIRMED appointments)
    const confirmedAppointments = await prisma.appointment.findMany({
        where: { status: 'CONFIRMED' },
        select: { service: true }
    })

    const revenue = confirmedAppointments.reduce((total: number, apt: { service: string }) => {
        return total + (PRICE_MAP[apt.service] || 0)
    }, 0)


    // Fetch recent data
    const recentAppointments = await prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })

    const recentUsers = await prisma.user.findMany({
        where: { role: 'USER' },
        take: 5,
        orderBy: { id: 'desc' } // Assuming ID corresponds to creation time roughly, or add createdAt to User model
    })

    return (
        <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-pink-600">Admin Dashboard</h1>
                <a href="/admin/settings" className="btn-outline text-sm">Profil Einstellungen</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-neutral-900 p-6 rounded-sm shadow-md border-l-4 border-pink-600">
                    <h3 className="font-bold text-lg mb-2 text-white">Termine</h3>
                    <p className="text-3xl font-bold text-white">{pendingCount}</p>
                    <p className="text-sm text-neutral-400">Ausstehende Anfragen</p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-sm shadow-md border-l-4 border-pink-600">
                    <h3 className="font-bold text-lg mb-2 text-white">Benutzer</h3>
                    <p className="text-3xl font-bold text-white">{userCount}</p>
                    <p className="text-sm text-neutral-400">Registrierte Kunden</p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-sm shadow-md border-l-4 border-pink-600">
                    <h3 className="font-bold text-lg mb-2 text-white">Umsatz (Geschätzt)</h3>
                    <p className="text-3xl font-bold text-white">{revenue} €</p>
                    <p className="text-sm text-neutral-400">Bestätigte Termine</p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-sm shadow-md border-l-4 border-pink-600">
                    <h3 className="font-bold text-lg mb-2 text-white">Startseite</h3>
                    <p className="text-sm text-neutral-400 mb-2">Hauptbild ändern</p>
                    <AdminHeroImageForm />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Appointments */}
                <section className="bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-800">
                    <h3 className="text-xl font-bold mb-4 text-white">Neueste Termine</h3>
                    {recentAppointments.length === 0 ? (
                        <p className="text-neutral-500">Keine Termine vorhanden.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentAppointments.map((apt: any) => (
                                <AdminAppointmentItem key={apt.id} apt={apt} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Users */}
                <section className="bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-800">
                    <h3 className="text-xl font-bold mb-4 text-white">Neueste Benutzer</h3>
                    {recentUsers.length === 0 ? (
                        <p className="text-neutral-500">Keine Benutzer vorhanden.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentUsers.map((u: any) => (
                                <div key={u.id} className="flex justify-between items-center border-b border-neutral-800 pb-2 last:border-0">
                                    <div>
                                        <p className="font-bold text-white">{u.name}</p>
                                        <p className="text-sm text-neutral-400">{u.email}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-pink-900/50 flex items-center justify-center text-pink-400 font-bold">
                                        {u.name?.[0].toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className="mt-8">
                <section className="bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-800">
                    <h3 className="text-xl font-bold mb-4 text-white">Schnellzugriff</h3>
                    <div className="flex gap-4 flex-wrap">
                        <Link href="/admin/services" className="btn-outline bg-neutral-800 hover:bg-neutral-700">Leistungen & Preise</Link>
                        <Link href="/admin/gallery" className="btn-outline bg-neutral-800 hover:bg-neutral-700">Galerie</Link>
                        <Link href="/admin/promotions" className="btn-outline bg-neutral-800 hover:bg-neutral-700">Sonderangebote</Link>
                        <Link href="/admin/slideshow" className="btn-outline bg-neutral-800 hover:bg-neutral-700">Slideshow</Link>
                        <span className="w-px bg-neutral-700 h-auto mx-2"></span>
                        <Link href="/admin/settings/hours" className="btn-outline bg-neutral-800 hover:bg-neutral-700">Öffnungszeiten</Link>
                    </div>
                </section>
            </div>
        </div>
    )
}
