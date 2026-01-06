'use client'

import { cancelBooking } from "@/lib/booking-actions"
import { useTransition } from "react"

export function CancelBookingButton({ appointmentId, isCancelled }: { appointmentId: string, isCancelled: boolean }) {
    const [isPending, startTransition] = useTransition()

    if (isCancelled) return <button disabled className="btn-outline border-red-900 text-red-500 opacity-50 cursor-not-allowed">Bereits Storniert</button>

    return (
        <button
            disabled={isPending}
            onClick={() => {
                if (confirm('Termin wirklich stornieren?')) {
                    startTransition(async () => { await cancelBooking(appointmentId) })
                }
            }}
            className="border border-red-700 text-red-500 hover:bg-red-900/20 px-4 py-2 rounded transition-colors"
        >
            {isPending ? '...' : 'Termin Stornieren'}
        </button>
    )
}
