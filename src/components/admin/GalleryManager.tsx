'use client'

import { uploadGalleryImage, deleteGalleryImage } from "@/lib/gallery-actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

function UploadButton() {
    const { pending } = useFormStatus()
    return (
        <button disabled={pending} type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition w-full">
            {pending ? 'Lädt hoch...' : 'Bild Hochladen'}
        </button>
    )
}

export function GalleryManager({ images }: { images: any[] }) {
    const [state, action] = useActionState(uploadGalleryImage, null)

    return (
        <div className="space-y-8">
            {/* Upload Form */}
            <div className="bg-neutral-900 p-6 rounded border border-neutral-800 max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Neues Bild für die Galerie</h3>
                <form action={action} className="space-y-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Bilddatei</label>
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-700 file:text-white hover:file:bg-pink-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Beschreibung (Alt-Text)</label>
                        <input name="alt" type="text" placeholder="z.B. Roter Nagellack mit Glitzer" className="input-field" />
                    </div>
                    <UploadButton />
                    {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
                    {state?.success && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
                </form>
            </div>

            {/* Gallery Grid */}
            <h3 className="text-xl font-bold text-white mb-4">Aktuelle Bilder</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img: any) => (
                    <div key={img.id} className="group relative aspect-square bg-neutral-800 rounded overflow-hidden border border-neutral-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.alt || 'Gallery Image'} className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <button
                                onClick={async () => {
                                    if (confirm('Dieses Bild wirklich löschen?')) await deleteGalleryImage(img.id, img.url)
                                }}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
