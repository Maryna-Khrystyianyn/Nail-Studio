'use client'

import { createService, deleteService } from "@/lib/service-actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button disabled={pending} type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            {pending ? 'Speichern...' : 'Hinzufügen'}
        </button>
    )
}

function DeleteButton({ id }: { id: string }) {
    return (
        <button
            onClick={async () => {
                if (confirm('Wirklich löschen?')) await deleteService(id)
            }}
            className="text-red-500 hover:text-red-300 text-sm underline"
        >
            Löschen
        </button>
    )
}

export function ServiceManager({ services }: { services: any[] }) {
    const [state, action] = useActionState(createService, null)

    const grouped = services.reduce((acc: any, s: any) => {
        if (!acc[s.category]) acc[s.category] = []
        acc[s.category].push(s)
        return acc
    }, {})

    return (
        <div className="space-y-8">
            {/* Add Form */}
            <div className="bg-neutral-900 p-6 rounded border border-neutral-800">
                <h3 className="text-xl font-bold text-white mb-4">Neue Leistung hinzufügen</h3>
                <form action={action} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm text-neutral-400 mb-1">Name</label>
                        <input name="name" type="text" placeholder="Bezeichnung" className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Kategorie</label>
                        <select name="category" className="input-field" required>
                            <option value="Manicure">Maniküre</option>
                            <option value="Pedicure">Pediküre</option>
                            <option value="Other">Sonstiges</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Preis</label>
                        <input name="price" type="text" placeholder="25 €" className="input-field" required />
                    </div>
                    <div>
                        <SubmitButton />
                    </div>
                </form>
                {state?.error && <p className="text-red-500 mt-2">{state.error}</p>}
                {state?.success && <p className="text-green-500 mt-2">{state.message}</p>}
                <p className="text-xs text-neutral-500 mt-4">Hinweis: Alle Leistungen sind standardmäßig auf 2 Stunden (120 Min) eingestellt.</p>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(grouped).map(cat => (
                    <div key={cat} className="bg-neutral-900 p-6 rounded border border-neutral-800">
                        <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-neutral-800 pb-2">
                            {cat === 'Manicure' ? 'Maniküre' : cat === 'Pedicure' ? 'Pediküre' : 'Sonstiges'}
                        </h3>
                        <ul className="space-y-3">
                            {grouped[cat].map((s: any) => (
                                <li key={s.id} className="flex justify-between items-start border-b border-neutral-800 pb-2 last:border-0">
                                    <div>
                                        <p className="font-bold text-white">{s.name}</p>
                                        <p className="text-sm text-neutral-500">{s.price}</p>
                                    </div>
                                    <DeleteButton id={s.id} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
