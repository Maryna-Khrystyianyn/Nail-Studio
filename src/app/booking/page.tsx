import BookingForm from "@/components/booking/BookingForm"
import { auth } from "@/auth"
import { getServices } from "@/lib/service-actions"

export default async function BookingPage() {
    const session = await auth()
    const services = await getServices()

    return (
        <div className="min-h-screen py-8 bg-black">
            <div className="container max-w-lg mx-auto px-4">
                <h1 className="text-4xl font-serif font-bold text-center mb-12 text-white">Termin Buchen</h1>
                <BookingForm user={session?.user} services={services} />
            </div>
        </div>
    )
}
