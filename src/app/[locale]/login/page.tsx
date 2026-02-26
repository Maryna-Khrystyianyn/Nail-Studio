'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import { useFormStatus } from 'react-dom'
import { Link } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { useEffect } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    const t = useTranslations('Auth')
    return (
        <button type="submit" aria-disabled={pending} className="btn-primary w-full">
            {pending ? t('loggingIn') : t('login')}
        </button>
    )
}

export default function LoginPage() {
    const [errorMessage, action] = useActionState(authenticate, undefined)
    const t = useTranslations('Auth')
    const locale = useLocale()

    useEffect(() => {
        if (errorMessage === 'success') {
            window.location.href = `/${locale}`
        }
    }, [errorMessage, locale])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
            <h1 className="text-4xl font-serif font-bold mb-8 text-white">{t('welcomeBack')}</h1>
            <form action={action} className="w-full max-w-md bg-neutral-900 p-8 rounded-sm shadow-xl border border-neutral-800">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-bold mb-2 text-neutral-300">{t('email')}</label>
                    <input name="email" type="email" required className="input-field" placeholder="jane@beispiel.de" />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-bold mb-2 text-neutral-300">{t('password')}</label>
                    <input name="password" type="password" required className="input-field" placeholder="••••••••" />
                </div>

                {errorMessage && (
                    <div className="mb-4 text-red-500 text-sm text-center">{errorMessage}</div>
                )}

                <SubmitButton />
            </form>

            <p className="mt-4 text-neutral-500">
                {t('noAccount')} <Link href="/register" className="text-pink-400 font-bold hover:text-pink-300 transition-colors">{t('register')}</Link>
            </p>
        </div>
    )
}
