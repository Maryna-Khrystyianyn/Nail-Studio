'use client'

import { updateSalonContactInfo } from "@/lib/settings-actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" disabled={pending} className="btn-primary w-full mt-4">
            {pending ? 'Speichern...' : 'Einstellungen speichern'}
        </button>
    )
}

export function SalonSettingsForm({ settings }: { settings: any }) {
    const [state, action] = useActionState(updateSalonContactInfo, null)

    return (
        <form action={action} className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-2 text-pink-300">Adresse</label>
                <input
                    className="input-field"
                    type="text"
                    name="address"
                    defaultValue={settings?.address || ''}
                    placeholder="Hauptstraße 1, 12345 Stadt"
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-pink-300">Email (Kontakt)</label>
                <input
                    className="input-field"
                    type="email"
                    name="email"
                    defaultValue={settings?.email || ''}
                    placeholder="kontakt@salon.de"
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-pink-300">Telefonnummer</label>
                <input
                    className="input-field"
                    type="tel"
                    name="phone"
                    defaultValue={settings?.phone || ''}
                    placeholder="+49 123 456789"
                />
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
