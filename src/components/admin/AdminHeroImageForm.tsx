'use client'

import { updateSalonHeroImage } from "@/lib/settings-actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" disabled={pending} className="btn-primary w-full mt-2">
            {pending ? 'Wird aktualisiert...' : 'Bild ändern'}
        </button>
    )
}

export function AdminHeroImageForm() {
    const [state, action] = useActionState(updateSalonHeroImage, null)

    return (
        <form action={action} className="mt-4">
            <input
                type="file"
                name="image"
                accept="image/*"
                required
                className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-700 file:text-white hover:file:bg-pink-600"
            />
            <SubmitButton />
            {state?.success && (
                <p className="text-green-600 text-sm text-center mt-2">{state.message}</p>
            )}
            {state?.error && (
                <p className="text-red-500 text-sm text-center mt-2">{state.error}</p>
            )}
        </form>
    )
}
