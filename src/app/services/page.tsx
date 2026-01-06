import Link from "next/link"
import { getServices } from "@/lib/service-actions"

export default async function ServicesPage() {
    const services = await getServices()

    // Group services by category
    const groupedServices = services.reduce((acc: any, s: any) => {
        if (!acc[s.category]) acc[s.category] = []
        acc[s.category].push(s)
        return acc
    }, {})

    // Helper to map DB category to Display Name
    const categoryName = (cat: string) => {
        if (cat === 'Manicure') return 'Maniküre'
        if (cat === 'Pedicure') return 'Pediküre'
        return 'Weitere Leistungen'
    }

    return (
        <div className="min-h-screen pb-16">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl md:text-5xl font-serif text-mauve-900 text-center mb-4">Unsere Leistungen</h1>
                <p className="text-mauve-700 text-center mb-16 max-w-2xl mx-auto">
                    Entdecken Sie unser breites Angebot an professionellen Nagelbehandlungen.
                    Wir verwenden nur hochwertige Produkte für Ihre Schönheit und Gesundheit.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Render each category */}
                    {Object.keys(groupedServices).sort().map(category => (
                        <div key={category} className="bg-white p-8 rounded-sm shadow-sm border border-mauve-800/10">
                            <h2 className="text-3xl font-serif text-mauve-900 mb-8 border-b border-light-pink pb-2 inline-block">
                                {categoryName(category)}
                            </h2>
                            <ul className="space-y-6">
                                {groupedServices[category].map((s: any) => (
                                    <li key={s.id} className="flex justify-between items-baseline group">
                                        <div className="flex-1">
                                            <span className="font-bold text-mauve-900 group-hover:text-mauve-700 transition">
                                                {s.name}
                                            </span>
                                            {/* Optional duration could go here */}
                                        </div>
                                        <span className="text-mauve-600 font-serif italic relative px-2 bg-white z-10">
                                            {s.price}
                                        </span>
                                        <div className="absolute w-full border-b border-dots border-mauve-200 bottom-1 left-0 -z-0"></div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-mauve-100 text-center">
                                <Link href="/booking" className="btn-primary inline-block">
                                    Jetzt Buchen
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
