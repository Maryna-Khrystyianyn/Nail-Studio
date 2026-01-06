'use client'

import { updateOpeningHours } from "@/lib/opening-hours-actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

export function OpeningHoursManager({ hours }: { hours: any[] }) {
    const router = useRouter()

    async function handleSave(day: any) {
        await updateOpeningHours(day.dayOfWeek, {
            isOpen: day.isOpen,
            start: day.start,
            end: day.end
        })
        router.refresh()
    }

    return (
        <div className="space-y-4">
            {hours.map((day) => (
                <DayRow key={day.id} day={day} label={DAYS[day.dayOfWeek]} onSave={handleSave} />
            ))}
        </div>
    )
}

function DayRow({ day, label, onSave }: { day: any, label: string, onSave: (d: any) => Promise<void> }) {
    const [localDay, setLocalDay] = useState(day)
    const [changed, setChanged] = useState(false)
    const [saving, setSaving] = useState(false)

    function update(field: string, value: any) {
        setLocalDay({ ...localDay, [field]: value })
        setChanged(true)
    }

    async function save() {
        setSaving(true)
        await onSave(localDay)
        setSaving(false)
        setChanged(false)
    }

    return (
        <div className={`p-4 rounded border ${localDay.isOpen ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-900/50 border-neutral-800 opacity-70'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={localDay.isOpen}
                        onChange={(e) => update('isOpen', e.target.checked)}
                        className="w-5 h-5 accent-pink-600 rounded"
                    />
                    <span className="font-bold text-white w-24">{label}</span>
                </div>
                {changed && (
                    <button
                        onClick={save}
                        disabled={saving}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        {saving ? '...' : 'Speichern'}
                    </button>
                )}
            </div>

            {localDay.isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                    <div className="flex gap-2 items-center">
                        <span className="text-xs text-neutral-500 w-12">Geöffnet</span>
                        <input
                            type="time"
                            value={localDay.start}
                            onChange={(e) => update('start', e.target.value)}
                            className="bg-neutral-800 text-white px-2 py-1 rounded border border-neutral-700 text-sm"
                        />
                        <span className="text-neutral-500">-</span>
                        <input
                            type="time"
                            value={localDay.end}
                            onChange={(e) => update('end', e.target.value)}
                            className="bg-neutral-800 text-white px-2 py-1 rounded border border-neutral-700 text-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
