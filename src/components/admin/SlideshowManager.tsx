'use client'

import { uploadSlideshowImage, deleteSlideshowImage } from '@/lib/slideshow-actions'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'

function UploadButton() {
    const { pending } = useFormStatus()
    return (
        <button disabled={pending} type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition w-full">
            {pending ? 'Lädt hoch...' : 'Bild Hochladen'}
        </button>
    )
}

export function SlideshowManager({ images }: { images: any[] }) {
    const [state, action] = useActionState(uploadSlideshowImage, null)

    return (
        <div className="space-y-8">
            <div className="bg-neutral-900 p-6 rounded border border-neutral-800 max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Neues Bild für Slideshow (Max. 3)</h3>
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
                    <UploadButton />
                    {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
                    {state?.success && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
                </form>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-4">Aktuelle Slideshow (Wird automatisch rotiert)</h3>
                <div className="flex gap-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative w-32 h-32 group border border-neutral-700 rounded overflow-hidden">
                            <img src={img.url} className="w-full h-full object-cover" alt="slideshow thumbnail" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={async () => {
                                        if (confirm("Löschen?")) await deleteSlideshowImage(img.id)
                                    }}
                                    className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                                >
                                    Entfernen
                                </button>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && <p className="text-neutral-500 italic">Noch keine Bilder hochgeladen.</p>}
                </div>
            </div>
        </div>
    )
}
