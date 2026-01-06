import Link from "next/link"
import { getActivePromotions } from "@/lib/promotion-actions"

export default async function PromotionsPage() {
    const promotions = await getActivePromotions()

    return (
        <div className="bg-black min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-serif font-bold text-white mb-4">Aktuelle Angebote</h1>
                    <p className="text-neutral-400">Verwöhnen Sie sich zum Vorteilspreis mit unseren saisonalen Aktionen.</p>
                </div>

                {promotions.length === 0 ? (
                    <div className="text-center py-12 max-w-lg mx-auto bg-neutral-900 rounded border border-neutral-800">
                        <p className="text-neutral-400 mb-4">Aktuell keine aktiven Sonderangebote.</p>
                        <p className="text-sm text-neutral-500">Folgen Sie uns oder schauen Sie später wieder vorbei!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {promotions.map((p: any, idx: number) => (
                            <div key={p.id} className={`p-8 rounded-sm border shadow-xl relative overflow-hidden ${idx % 2 === 0 ? 'bg-gradient-to-br from-neutral-100 to-gray-300 text-black border-white/20' : 'bg-neutral-900 text-white border-neutral-700'}`}>
                                {idx % 2 !== 0 && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                )}

                                <div className={`uppercase tracking-wide text-sm font-bold mb-2 ${idx % 2 === 0 ? 'text-pink-600' : 'text-pink-400'}`}>
                                    {p.subtitle || 'Sonderangebot'}
                                </div>
                                <h2 className="text-3xl font-serif font-bold mb-4">{p.title}</h2>
                                <p className={`mb-6 font-medium ${idx % 2 === 0 ? 'text-neutral-700' : 'text-neutral-300'}`}>{p.description}</p>

                                <Link href="/booking" className={`inline-block px-4 py-2 rounded-sm font-bold transition shadow-lg ${idx % 2 === 0 ? 'btn-primary' : 'bg-white text-black hover:bg-gray-200'}`}>
                                    Jetzt buchen
                                </Link>

                                <div className={`text-xs mt-6 opacity-60 ${idx % 2 === 0 ? 'text-neutral-600' : 'text-neutral-500'}`}>
                                    Gültig von {new Date(p.validFrom).toLocaleDateString((['de-DE']))} bis {new Date(p.validUntil).toLocaleDateString(['de-DE'])}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
