'use client'

import { confirmBooking } from "@/lib/booking-actions"
import { useTransition } from "react"
import Link from "next/link"

export function AdminAppointmentItem({ apt }: { apt: any }) {
    const [isPending, startTransition] = useTransition()

    return (
        <div className="border-b border-neutral-800 pb-2 last:border-0">
            <div className="flex justify-between items-start">
                <Link href={`/admin/appointments/${apt.id}`} className="hover:bg-[#f7e7ec] block flex-1 group rounded p-1 -m-1 transition-colors">
                    <div>
                        <p className="font-bold text-mauve-700 group-hover:text-gray-700 transition-colors">{apt.service}</p>
                        <p className="text-sm text-neutral-400">
                            {apt.guestName || apt.user?.name || 'Unbekannt'}
                            <span className="text-neutral-600"> | </span>
                            {new Date(apt.date).toLocaleDateString('de-DE')} {new Date(apt.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </Link>
                <div className="flex gap-2 items-center">
                    <span className={`px-2 py-1 text-xs rounded font-bold ${apt.status === 'PENDING' ? 'bg-yellow-900 text-yellow-200' : apt.status === 'CONFIRMED' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                        {apt.status}
                    </span>
                    {apt.status === 'PENDING' && (
                        <button
                            disabled={isPending}
                            onClick={() => startTransition(async () => { await confirmBooking(apt.id) })}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded cursor-pointer disabled:opacity-50"
                        >
                            {isPending ? '...' : 'Bestätigen'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
