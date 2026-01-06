'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" aria-disabled={pending} className="btn-primary w-full">
            {pending ? 'Anmelden...' : 'Anmelden'}
        </button>
    )
}

export default function LoginPage() {
    const [errorMessage, action] = useActionState(authenticate, undefined)

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
            <h1 className="text-4xl font-serif font-bold mb-8 text-white">Willkommen zurück</h1>
            <form action={action} className="w-full max-w-md bg-neutral-900 p-8 rounded-sm shadow-xl border border-neutral-800">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-bold mb-2 text-neutral-300">E-Mail Adresse</label>
                    <input name="email" type="email" required className="input-field" placeholder="jane@beispiel.de" />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-bold mb-2 text-neutral-300">Passwort</label>
                    <input name="password" type="password" required className="input-field" placeholder="••••••••" />
                </div>

                {errorMessage && (
                    <div className="mb-4 text-red-500 text-sm text-center">{errorMessage}</div>
                )}

                <SubmitButton />
            </form>

            <p className="mt-4 text-neutral-500">
                Noch kein Konto? <Link href="/register" className="text-pink-400 font-bold hover:text-pink-300 transition-colors">Registrieren</Link>
            </p>
        </div>
    )
}
