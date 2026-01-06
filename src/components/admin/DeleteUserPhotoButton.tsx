'use client'

import { deleteUserPhoto } from "@/lib/upload-actions"
import { useTransition } from "react"

export function DeleteUserPhotoButton({ photoId, userId }: { photoId: string, userId: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm('Möchten Sie dieses Foto wirklich löschen?')) {
            startTransition(async () => {
                const res = await deleteUserPhoto(photoId, userId)
                if (res?.error) {
                    alert(res.error)
                }
            })
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            title="Foto löschen"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    )
}
