'use client'

import { cancelBooking } from "@/lib/booking-actions"
import { useTransition, useState } from "react"

export function UserAppointmentItem({ apt, statusMap }: { apt: any, statusMap: Record<string, string> }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState('')

    const handleCancel = () => {
        if (!confirm('Möchten Sie diesen Termin wirklich stornieren?')) return;

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
                    {new Date(apt.date).toLocaleDateString('de-DE')} {new Date(apt.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-2 text-neutral-600">|</span>
                    <span className={`${apt.status === 'CONFIRMED' ? 'text-green-500' : apt.status === 'CANCELLED' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {statusMap[apt.status] || apt.status}
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
                        {isPending ? 'Stornieren...' : 'Stornieren'}
                    </button>
                )}
            </div>
        </li>
    )
}
