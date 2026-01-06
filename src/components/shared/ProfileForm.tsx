'use client'

import { updateProfile } from "@/lib/profile-actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" disabled={pending} className="btn-primary w-full mt-4">
            {pending ? 'Speichern...' : 'Änderungen speichern'}
        </button>
    )
}

export function ProfileForm({ user }: { user: any }) {
    const [state, action] = useActionState(updateProfile, null)

    return (
        <form action={action} className="space-y-4 max-w-md mx-auto">
            {/* Avatar Preview if available */}
            <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-500 bg-neutral-800 relative">
                    {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-pink-500 text-3xl font-bold">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-pink-300">Profilbild (Optional)</label>
                <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-900 file:text-pink-300 hover:file:bg-pink-800"
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-pink-300">Name</label>
                <input
                    className="input-field"
                    type="text"
                    name="name"
                    defaultValue={user.name || ''}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-pink-300">Email</label>
                <input
                    className="input-field"
                    type="email"
                    name="email"
                    defaultValue={user.email || ''}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-pink-300">Telefonnummer</label>
                <input
                    className="input-field"
                    type="tel"
                    name="phone"
                    defaultValue={user.phoneNumber || ''}
                    placeholder="Optional"
                />
            </div>

            <div className="pt-4 border-t border-neutral-800 mt-6">
                <h3 className="text-white font-bold mb-4">Passwort ändern (Optional)</h3>
                <div>
                    <input
                        className="input-field"
                        type="password"
                        name="password"
                        placeholder="Neues Passwort (min. 6 Zeichen)"
                    />
                    <p className="text-xs text-neutral-500 mt-1">Lassen Sie dieses Feld leer, wenn Sie Ihr Passwort nicht ändern möchten.</p>
                </div>
            </div>

            <SubmitButton />

            {state?.success && (
                <p className="text-green-400 text-sm text-center mt-2">{state.message}</p>
            )}
            {state?.error && (
                <p className="text-red-400 text-sm text-center mt-2">{state.error}</p>
            )}
        </form>
    )
}
