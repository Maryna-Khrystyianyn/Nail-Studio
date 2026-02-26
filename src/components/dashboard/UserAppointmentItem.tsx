'use client'

import { cancelBooking } from "@/lib/booking-actions"
import { useTransition, useState } from "react"
import { useTranslations, useLocale } from 'next-intl'

export function UserAppointmentItem({ apt }: { apt: any }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState('')
    const t = useTranslations('Dashboard')
    const locale = useLocale()

    const handleCancel = () => {
        if (!confirm(t('cancelConfirm'))) return;

        setError('')
        startTransition(async () => {
            const res = await cancelBooking(apt.id)
            if (res.error) {
                setError(res.error)
                alert(res.error)
            }
        })
    }

    const canCancel = apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED'

    return (
        <li className="flex justify-between items-center border-b border-neutral-800 pb-2 last:border-0">
            <div>
                <p className="font-bold text-white">{apt.service}</p>
                <div className="text-sm text-neutral-400">
                    {new Date(apt.date).toLocaleDateString(locale)} {new Date(apt.date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-2 text-neutral-600">|</span>
                    <span className={`${apt.status === 'CONFIRMED' ? 'text-green-500' : apt.status === 'CANCELLED' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {t(`status.${apt.status}`)}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                {canCancel && (
                    <button
                        disabled={isPending}
                        onClick={handleCancel}
                        className="text-red-500 hover:text-red-400 text-xs underline disabled:opacity-50"
                    >
                        {isPending ? t('cancelling') : t('cancel')}
                    </button>
                )}
            </div>
        </li>
    )
}
