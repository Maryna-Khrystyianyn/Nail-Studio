import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getGalleryImages } from "@/lib/gallery-actions"
import { GalleryManager } from "@/components/admin/GalleryManager"
import Link from "next/link"

export default async function AdminGalleryPage() {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') redirect("/")

    const images = await getGalleryImages()

    return (
        <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="text-neutral-400 hover:text-white transition">← Zurück</Link>
                <h1 className="text-3xl font-serif font-bold text-pink-600">Galerie bearbeiten</h1>
            </div>

            <GalleryManager images={images} />
        </div>
    )
}
