import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminAppointmentsPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
        redirect("/")
    }

    const currentPage = Number(params.page) || 1
    const pageSize = 10
    const skip = (currentPage - 1) * pageSize

    const [appointments, totalCount] = await Promise.all([
        prisma.appointment.findMany({
            take: pageSize,
            skip: skip,
            orderBy: { date: 'desc' },
            include: { user: true }
        }),
        prisma.appointment.count()
    ])

    const totalPages = Math.ceil(totalCount / pageSize)

    const statusMap: Record<string, string> = {
        'PENDING': 'Ausstehend',
        'CONFIRMED': 'Bestätigt',
        'CANCELLED': 'Storniert',
        'COMPLETED': 'Abgeschlossen'
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <Link href="/admin" className="text-pink-400 hover:underline">← Zurück zum Dashboard</Link>
                <div className="text-right">
                    <h1 className="text-3xl font-serif font-bold text-white leading-tight">Alle Termine</h1>
                    <p className="text-neutral-500 text-sm">Gesamt: {totalCount} Einträge</p>
                </div>
            </div>

            <div className="bg-neutral-900 rounded-sm border border-neutral-800 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="text-xs uppercase text-neutral-500 bg-neutral-800/50 border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-4">Datum & Zeit</th>
                                <th className="px-6 py-4">Kunde</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aktion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        Keine Termine gefunden.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((apt: any) => (
                                    <tr key={apt.id} className="hover:bg-neutral-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">
                                                {new Date(apt.date).toLocaleDateString('de-DE')}
                                            </div>
                                            <div className="text-xs text-neutral-500">
                                                {new Date(apt.date).toLocaleTimeString('de-DE', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })} Uhr
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-pink-300">
                                                {apt.user?.name || apt.guestName || 'Unbekannt'}
                                            </div>
                                            <div className="text-xs text-neutral-500">
                                                {apt.user?.email || apt.guestEmail || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {apt.service}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${apt.status === 'CONFIRMED' ? 'bg-green-900/30 text-green-500' :
                                                    apt.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-500' :
                                                        apt.status === 'CANCELLED' ? 'bg-red-900/30 text-red-500' :
                                                            'bg-neutral-800 text-neutral-400'
                                                }`}>
                                                {statusMap[apt.status] || apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/appointments/${apt.id}`}
                                                className="text-pink-400 hover:text-pink-300 font-bold transition-colors"
                                            >
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <Link
                        href={`/admin/appointments?page=${currentPage - 1}`}
                        className={`px-4 py-2 rounded-sm border border-neutral-800 text-sm transition-colors ${currentPage <= 1 ? 'pointer-events-none opacity-30 bg-neutral-900' : 'bg-neutral-900 hover:bg-neutral-800 text-white'}`}
                    >
                        Vorherige
                    </Link>

                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <Link
                                key={pageNum}
                                href={`/admin/appointments?page=${pageNum}`}
                                className={`w-10 h-10 flex items-center justify-center rounded-sm text-sm border transition-colors ${currentPage === pageNum
                                        ? 'bg-pink-600 border-pink-600 text-white'
                                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                                    }`}
                            >
                                {pageNum}
                            </Link>
                        ))}
                    </div>

                    <Link
                        href={`/admin/appointments?page=${currentPage + 1}`}
                        className={`px-4 py-2 rounded-sm border border-neutral-800 text-sm transition-colors ${currentPage >= totalPages ? 'pointer-events-none opacity-30 bg-neutral-900' : 'bg-neutral-900 hover:bg-neutral-800 text-white'}`}
                    >
                        Nächste
                    </Link>
                </div>
            )}
        </div>
    )
}
