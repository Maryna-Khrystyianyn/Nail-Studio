'use client'

import { createPromotion, deletePromotion } from "@/lib/promotion-actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button disabled={pending} type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            {pending ? 'Erstelle...' : 'Angebot erstellen'}
        </button>
    )
}

export function PromotionManager({ promotions }: { promotions: any[] }) {
    const [state, action] = useActionState(createPromotion, null)

    return (
        <div className="space-y-8">
            {/* Add Form */}
            <div className="bg-neutral-900 p-6 rounded border border-neutral-800">
                <h3 className="text-xl font-bold text-white mb-4">Neues Sonderangebot hinzufügen</h3>
                <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Titel</label>
                        <input name="title" type="text" placeholder="z.B. Sommer-Special" className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Untertitel (Optional)</label>
                        <input name="subtitle" type="text" placeholder="z.B. 20% Rabatt" className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm text-neutral-400 mb-1">Beschreibung</label>
                        <textarea name="description" placeholder="Details zum Angebot..." className="input-field h-24" required></textarea>
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Gültig von</label>
                        <input name="validFrom" type="date" className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Gültig bis</label>
                        <input name="validUntil" type="date" className="input-field" required />
                    </div>

                    <div className="md:col-span-2 mt-2">
                        <SubmitButton />
                        {state?.error && <p className="text-red-500 mt-2">{state.error}</p>}
                        {state?.success && <p className="text-green-500 mt-2">{state.message}</p>}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((p: any) => {
                    const isActive = new Date() >= new Date(p.validFrom) && new Date() <= new Date(p.validUntil)
                    return (
                        <div key={p.id} className={`p-6 rounded border ${isActive ? 'bg-pink-900/20 border-pink-600' : 'bg-neutral-900 border-neutral-800 opacity-70'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                                {p.subtitle && <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded">{p.subtitle}</span>}
                            </div>
                            <p className="text-neutral-400 text-sm mb-4 line-clamp-3">{p.description}</p>

                            <div className="text-xs text-neutral-500 mb-4">
                                {new Date(p.validFrom).toLocaleDateString('de-DE')} - {new Date(p.validUntil).toLocaleDateString('de-DE')}
                            </div>

                            <button
                                onClick={async () => {
                                    if (confirm('Wirklich löschen?')) await deletePromotion(p.id)
                                }}
                                className="text-red-500 hover:text-red-300 text-sm underline"
                            >
                                Löschen
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
