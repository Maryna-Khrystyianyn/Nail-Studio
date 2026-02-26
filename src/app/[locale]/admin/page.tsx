import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AdminAppointmentItem } from "@/components/admin/AdminAppointmentItem"
import { Link } from "@/i18n/routing"
import { getTranslations } from 'next-intl/server'
import { redirect } from "next/navigation"

// Simple price map for estimation (should ideally be in DB)
const PRICE_MAP: Record<string, number> = {
    'Klassische Maniküre (25 €)': 25,
    'Gel Maniküre (45 €)': 45,
    'Acryl Neumodellage (60 €)': 60,
    'Klassische Pediküre (35 €)': 35,
}

export default async function AdminPage() {
    const session = await auth()
    const t = await getTranslations('Admin')

    if (!session || session.user?.role !== 'ADMIN') {
        redirect("/")
        return null
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
        where: {
            status: { not: 'CANCELLED' }
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })

    const recentUsers = await prisma.user.findMany({
        where: { role: 'USER' },
        take: 5,
        orderBy: { id: 'desc' }
    })

    return (
        <div className="container mx-auto px-4 py-8  min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl md:text-5xl font-serif text-mauve-900 text-center mb-4">{t('title')}</h1>
                <Link href="/admin/settings" className="btn-outline text-mauve-700 text-sm">{t('profileSettings')}</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-mauve-700 p-6 rounded-sm shadow-md border-l-4 border-pink-600">
                    <h3 className="font-bold text-lg mb-2 text-white">{t('newAppointments')}</h3>
                    <p className="text-3xl font-bold text-white">{pendingCount}</p>
                    <p className="text-sm text-neutral-400">{t('pendingRequests')}</p>
                </div>

                <div className="bg-mauve-700 p-6 rounded-sm shadow-md border-l-4 border-pink-600">
                    <h3 className="font-bold text-lg mb-2 text-white">{t('users')}</h3>
                    <p className="text-3xl font-bold text-white">{userCount}</p>
                    <p className="text-sm text-neutral-400">{t('registeredCustomers')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Appointments */}
                <section className=" p-6 rounded-sm shadow-sm border border-neutral-800">
                    <h3 className="text-xl font-bold mb-4 text-pink-600">{t('recentAppointments')}</h3>
                    {recentAppointments.length === 0 ? (
                        <p className="text-neutral-700">{t('noAppointments')}</p>
                    ) : (
                        <div className="space-y-4">
                            {recentAppointments.map((apt: any) => (
                                <AdminAppointmentItem key={apt.id} apt={apt} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Users */}
                <section className=" p-6 rounded-sm shadow-sm border border-neutral-800">
                    <h3 className="text-xl font-bold mb-4 text-pink-600">{t('recentUsers')}</h3>
                    {recentUsers.length === 0 ? (
                        <p className="text-neutral-700">{t('noUsers')}</p>
                    ) : (
                        <div className="space-y-4">
                            {recentUsers.map((u: any) => (
                                <Link key={u.id} href={`/admin/users/${u.id}`} className="flex justify-between items-center border-b border-neutral-800 pb-2 last:border-0 hover:bg-[#f7e7ec] group p-1 -m-1  transition-colors">
                                    <div>
                                        <p className="font-bold text-mauve-700 group-hover:text-black transition-colors">{u.name}</p>
                                        <p className="text-sm text-neutral-400">{u.email}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-pink-900/50 flex items-center justify-center text-white font-bold">
                                        {u.name?.[0].toUpperCase()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className="mt-8">
                <section className="bg-mauve-700/50 p-6 rounded-sm shadow-sm border border-neutral-800">
                    <h3 className="text-xl font-bold mb-4 text-pink-700">{t('quickAccess')}</h3>
                    <div className="flex gap-4 flex-wrap">
                        <Link href="/admin/appointments" className="btn-outline bg-neutral-800 hover:bg-neutral-700">{t('allAppointments')}</Link>
                        <Link href="/admin/services" className="btn-outline bg-neutral-800 hover:bg-neutral-700">{t('servicesPrices')}</Link>
                        <Link href="/admin/gallery" className="btn-outline bg-neutral-800 hover:bg-neutral-700">{t('gallery')}</Link>
                        <Link href="/admin/promotions" className="btn-outline bg-neutral-800 hover:bg-neutral-700">{t('promotions')}</Link>
                        <Link href="/admin/slideshow" className="btn-outline bg-neutral-800 hover:bg-neutral-700">{t('slideshow')}</Link>
                        <Link href="/admin/settings/hours" className="btn-outline bg-neutral-800 hover:bg-neutral-700">{t('openingHours')}</Link>
                    </div>
                </section>
            </div>
        </div>
    )
}
