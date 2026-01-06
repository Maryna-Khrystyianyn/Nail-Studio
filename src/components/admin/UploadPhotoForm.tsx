'use client'

import { uploadUserPhoto } from "@/lib/upload-actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" disabled={pending} className="btn-primary text-sm py-2">
            {pending ? 'Wird hochgeladen...' : 'Foto hochladen'}
        </button>
    )
}

export function UploadPhotoForm({ userId }: { userId: string }) {
    const [state, action] = useActionState(async (prev: any, formData: FormData) => {
        const res = await uploadUserPhoto(formData)
        if (res.error) return { message: res.error, type: 'error' }
        return { message: 'Foto erfolgreich hochgeladen', type: 'success' }
    }, null)

    return (
        <form action={action} className="space-y-3">
            <input type="hidden" name="userId" value={userId} />
            <input
                type="file"
                name="photo"
                accept="image/*"
                required
                className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-900 file:text-pink-300 hover:file:bg-pink-800"
            />
            <SubmitButton />
            {state?.message && (
                <p className={`text-sm ${state.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                    {state.message}
                </p>
            )}
        </form>
    )
}
