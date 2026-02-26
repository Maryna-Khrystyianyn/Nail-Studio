import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { DeleteUserPhotoButton } from "@/components/admin/DeleteUserPhotoButton"

export default async function AdminUserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
        redirect("/")
    }

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            photos: {
                orderBy: { createdAt: 'desc' }
            },
            appointments: {
                orderBy: { date: 'desc' },
                take: 10
            }
        }
    }) as any // Using any for simplicity as it's a quick fix, but ideally should be typed based on include

    if (!user) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <a href="/admin" className="text-pink-400 hover:underline">← Zurück zum Dashboard</a>
                <span className="text-neutral-500 text-sm italic">Kunden-ID: {user.id}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="md:col-span-1 border border-neutral-800 p-6 rounded-sm bg-neutral-900 shadow-sm h-fit">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-pink-700 bg-neutral-800 mx-auto mb-6 relative flex items-center justify-center">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || 'Benutzer'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-pink-500 text-5xl font-bold uppercase">
                                {user.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl font-serif font-bold text-center text-white mb-2">{user.name}</h1>
                    <p className="text-center text-neutral-400 mb-6">{user.email}</p>

                    <div className="space-y-4 border-t border-neutral-800 pt-6">
                        <div>
                            <label className="block text-xs font-bold text-pink-600 uppercase mb-1">Telefon</label>
                            <p className="text-white">{user.phoneNumber || 'Nicht angegeben'}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-pink-600 uppercase mb-1">Rolle</label>
                            <p className="text-white">{user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Gallery & History */}
                <div className="md:col-span-2 space-y-8">
                    {/* User Gallery */}
                    <section className="bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-800">
                        <h2 className="text-xl font-serif font-bold mb-6 text-white border-b border-neutral-800 pb-2">Kunden-Galerie</h2>
                        {user.photos.length === 0 ? (
                            <p className="text-neutral-500 italic text-center py-12">Noch keine Fotos für diesen Kunden hochgeladen.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {user.photos.map((photo: any) => (
                                    <div key={photo.id} className="aspect-square relative rounded overflow-hidden border border-neutral-800 group">
                                        <img
                                            src={photo.url}
                                            alt="Behandlungsergebnis"
                                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                        />
                                        <DeleteUserPhotoButton photoId={photo.id} userId={user.id} />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            {new Date(photo.createdAt).toLocaleDateString('de-DE')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Recent Appointments */}
                    <section className="bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-800">
                        <h2 className="text-xl font-serif font-bold mb-6 text-white border-b border-neutral-800 pb-2">Letzte Termine (Max. 10)</h2>
                        {user.appointments.length === 0 ? (
                            <p className="text-neutral-500 italic text-center py-4">Bisher keine Termine gebucht.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-neutral-300">
                                    <thead className="text-xs uppercase text-neutral-500 border-b border-neutral-800">
                                        <tr>
                                            <th className="px-2 py-3">Datum</th>
                                            <th className="px-2 py-3">Service</th>
                                            <th className="px-2 py-3 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        {user.appointments.map((apt: any) => (
                                            <tr key={apt.id} className="hover:bg-neutral-800/50 transition-colors">
                                                <td className="px-2 py-3">
                                                    {new Date(apt.date).toLocaleDateString('de-DE')}
                                                </td>
                                                <td className="px-2 py-3 font-medium text-white">{apt.service}</td>
                                                <td className="px-2 py-3 text-right">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apt.status === 'CONFIRMED' ? 'bg-green-900/30 text-green-500' :
                                                        apt.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-500' :
                                                            apt.status === 'CANCELLED' ? 'bg-red-900/30 text-red-500' :
                                                                'bg-neutral-800 text-neutral-400'
                                                        }`}>
                                                        {apt.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}
