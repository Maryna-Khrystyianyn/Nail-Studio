import { SlideshowManager } from "@/components/admin/SlideshowManager"
import { getSlideshowImages } from "@/lib/slideshow-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Page() {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/")
    }

    const images = await getSlideshowImages()

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-serif font-bold text-pink-600 mb-8">Slideshow Verwaltung</h1>
            <SlideshowManager images={images} />
        </div>
    )
}
