import { getGalleryImages } from "@/lib/gallery-actions"

export default async function GalleryPage() {
    const images = await getGalleryImages()

    return (
        <div className=" min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-mauve-900 text-center mb-4">Unsere Meisterwerke</h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto">Entdecken Sie unser Portfolio exquisiter Nageldesigns, von elegantem Minimalismus bis hin zu extravaganter Kunst.</p>
                </div>

                {images.length === 0 ? (
                    <div className="text-center py-16 text-neutral-500">
                        <p>Die Galerie wird derzeit aktualisiert. Schauen Sie bald wieder vorbei.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((img: any) => (
                            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-sm bg-neutral-900 cursor-pointer border border-neutral-800">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.url}
                                    alt={img.alt || 'Nail Design'}
                                    className="object-cover w-full h-full transition duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                    <span className="text-white font-serif italic text-lg border-b border-pink-500 pb-1">{img.alt || 'Details ansehen'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
