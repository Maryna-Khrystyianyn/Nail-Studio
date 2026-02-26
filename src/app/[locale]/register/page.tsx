'use client'

import { useActionState } from 'react'
import { register } from '@/lib/actions'
import { useFormStatus } from 'react-dom'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

function SubmitButton() {
    const { pending } = useFormStatus()
    const t = useTranslations('Auth')
    return (
        <button type="submit" disabled={pending} aria-disabled={pending} className="btn-primary w-full">
            {pending ? t('creatingAccount') : t('createAccount')}
        </button>
    )
}

export default function RegisterPage() {
    const [state, action] = useActionState(register, undefined)
    const t = useTranslations('Auth')

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
            <h1 className="text-4xl font-serif font-bold mb-8 text-white">{t('joinUs')}</h1>
            <form action={action} className="w-full max-w-md bg-neutral-900 p-8 rounded-sm shadow-xl border border-neutral-800">
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-neutral-300" htmlFor="name">
                        {t('fullName')}
                    </label>
                    <input
                        className="input-field"
                        id="name"
                        type="text"
                        name="name"
                        placeholder={t('fullName')}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-neutral-300" htmlFor="email">
                        {t('email')}
                    </label>
                    <input
                        className="input-field"
                        id="email"
                        type="email"
                        name="email"
                        placeholder={t('email')}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-neutral-300" htmlFor="phone">
                        {t('phoneNumber')}
                    </label>
                    <input
                        className="input-field"
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder={t('phoneNumber')}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 text-neutral-300" htmlFor="password">
                        {t('password')}
                    </label>
                    <input
                        className="input-field"
                        id="password"
                        type="password"
                        name="password"
                        placeholder={t('password')}
                        required
                    />
                </div>
                <div className="mb-4">
                    {state && state !== 'success' && (
                        <div className="text-red-500 text-sm text-center">{state}</div>
                    )}
                    {state === 'success' && (
                        <div className="text-green-500 text-sm text-center">{t('success')}</div>
                    )}
                </div>
                <SubmitButton />
            </form>
            <p className="mt-4 text-neutral-500">
                {t('alreadyHaveAccount')} <Link href="/login" className="text-pink-400 font-bold hover:text-pink-300 transition-colors">{t('loginInstead')}</Link>
            </p>
        </div>
    )
}
