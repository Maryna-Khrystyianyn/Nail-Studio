import BookingForm from "@/components/booking/BookingForm"
import { auth } from "@/auth"
import { getServices } from "@/lib/service-actions"
import { getTranslations } from 'next-intl/server'

export default async function BookingPage() {
    const session = await auth()
    const services = await getServices()
    const t = await getTranslations('Booking')

    return (
        <div className="min-h-screen py-8 ">
            <div className="container max-w-lg mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-serif text-mauve-900 text-center mb-4">{t('title')}</h1>
                <BookingForm user={session?.user} services={services} />
            </div>
        </div>
    )
}
