import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { UserAppointmentItem } from "@/components/dashboard/UserAppointmentItem"
import { getTranslations } from 'next-intl/server'
import { Link } from "@/i18n/routing"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const session = await auth()
    const t = await getTranslations('Dashboard')

    if (!session || !session.user) {
        redirect("/login")
    }

    const userId = session.user.id as string
    const user = session.user

    const now = new Date()
    const appointments = await prisma.appointment.findMany({
        where: {
            userId: userId,
            OR: [
                { status: { not: 'CANCELLED' } },
                {
                    status: 'CANCELLED',
                    date: { gt: now }
                }
            ]
        },
        orderBy: { date: 'desc' }
    })

    const photos = await prisma.userPhoto.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
            <h1 className="text-3xl font-serif font-bold mb-6 text-white">{t('title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 border border-neutral-800 p-6 rounded-sm bg-neutral-900 shadow-sm h-fit">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-700 bg-neutral-800 mx-auto mb-4 relative flex items-center justify-center">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={t('profilePicture')}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-pink-500 text-3xl font-bold">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-center text-white">{user.name}</h2>
                    <p className="text-center text-neutral-500 text-sm mb-2">{user.email}</p>
                    {user.phoneNumber && <p className="text-center text-neutral-500 text-xs">{user.phoneNumber}</p>}
                    <div className="mt-4 flex justify-center">
                        <Link href="/dashboard/settings" className="border border-pink-700 text-pink-500 hover:bg-pink-900/20 px-3 py-1 rounded text-sm transition-colors">
                            {t('editProfile')}
                        </Link>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                    <section className="bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-800">
                        <h3 className="text-xl font-serif font-bold mb-4 text-white">{t('myAppointments')}</h3>
                        {appointments.length === 0 ? (
                            <p className="text-neutral-500">{t('noAppointments')}</p>
                        ) : (
                            <ul className="space-y-4">
                                {appointments.map((apt: any) => (
                                    <UserAppointmentItem key={apt.id} apt={apt} />
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-800">
                        <h3 className="text-xl font-serif font-bold mb-4 text-white">{t('myGallery')}</h3>
                        {photos.length === 0 ? (
                            <p className="text-neutral-500">{t('noPhotos')}</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {photos.map((photo: any) => (
                                    <div key={photo.id} className="aspect-square relative rounded overflow-hidden border border-neutral-800">
                                        <img src={photo.url} alt="Manicure Result" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}
