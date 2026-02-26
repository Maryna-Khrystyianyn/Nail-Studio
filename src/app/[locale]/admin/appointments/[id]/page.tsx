import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UploadPhotoForm } from "@/components/admin/UploadPhotoForm"
import { CancelBookingButton } from "@/components/admin/CancelBookingButton"
import Link from "next/link"

export default async function AdminAppointmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
        redirect("/")
    }

    const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: { user: true }
    })

    if (!appointment) {
        return <div className="text-white p-8">Termin nicht gefunden.</div>
    }

    // Determine user info (registered vs guest)
    const userInfo = appointment.user ? {
        name: appointment.user.name,
        email: appointment.user.email,
        phone: appointment.user.phoneNumber || 'Keine Nummer'
    } : {
        name: appointment.guestName,
        email: appointment.guestEmail,
        phone: appointment.guestPhone
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
            <div className="mb-6">
                <a href="/admin" className="text-pink-400 hover:underline">← Zurück zum Dashboard</a>
            </div>

            <h1 className="text-3xl font-serif font-bold mb-6 text-white">Termin Details</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Appointment Info */}
                <section className="bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-800">
                    <h2 className="text-xl font-bold mb-4 text-pink-300">Termin</h2>
                    <div className="space-y-4 text-neutral-300">
                        <p><strong>Service:</strong> {appointment.service}</p>
                        <p><strong>Datum:</strong> {new Date(appointment.date).toLocaleDateString('de-DE')}</p>
                        <p><strong>Zeit:</strong> {new Date(appointment.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><strong>Status:</strong> {appointment.status}</p>
                        <p><strong>Kommentar:</strong> {appointment.comments || '-'}</p>

                        <div className="pt-4">
                            <CancelBookingButton appointmentId={appointment.id} isCancelled={appointment.status === 'CANCELLED'} />
                        </div>
                    </div>
                </section>

                {/* User Info */}
                <section className="bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-800">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                        {appointment.user ? (
                            <Link href={`/admin/users/${appointment.user.id}`} className="flex items-center gap-6 hover:bg-neutral-800 p-2 -m-2 rounded transition-colors group">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-700 bg-neutral-800 flex items-center justify-center flex-shrink-0">
                                    {appointment.user.image ? (
                                        <img
                                            src={appointment.user.image}
                                            alt="Profilbild"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-pink-500 text-2xl font-bold uppercase">
                                            {(userInfo.name?.[0] || 'U').toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-pink-300 group-hover:text-pink-100 transition-colors">Kunde</h2>
                                    <p className="text-neutral-400 text-sm">Registrierter Benutzer</p>
                                </div>
                            </Link>
                        ) : (
                            <>
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-700 bg-neutral-800 flex items-center justify-center flex-shrink-0">
                                    <div className="text-pink-500 text-2xl font-bold uppercase">
                                        {(userInfo.name?.[0] || 'G').toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-pink-300">Kunde</h2>
                                    <p className="text-neutral-400 text-sm">Gast</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-2 text-neutral-300">
                        <p><strong>Name:</strong> {userInfo.name}</p>
                        <p><strong>Email:</strong> {userInfo.email}</p>
                        <p><strong>Tel:</strong> {userInfo.phone}</p>

                        {appointment.user && (
                            <div className="mt-8 pt-6 border-t border-neutral-800">
                                <h3 className="text-lg font-bold mb-2 text-white">Portfolio Upload</h3>
                                <p className="text-sm text-neutral-500 mb-4">Laden Sie ein Foto des Ergebnisses für das Profil des Kunden hoch.</p>
                                <UploadPhotoForm userId={appointment.user.id} />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
