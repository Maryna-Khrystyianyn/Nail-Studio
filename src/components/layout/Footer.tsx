import { getOpeningHours } from "@/lib/opening-hours-actions"

export async function Footer() {
    const hours = await getOpeningHours()

    // Helper to format hours for display
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

    const sortedHours = [...hours.filter((h: any) => h.dayOfWeek !== 0), hours.find((h: any) => h.dayOfWeek === 0)].filter(Boolean)

    const displayGroups: { label: string, time: string }[] = []

    let startDayIdx = 0

    for (let i = 0; i < sortedHours.length; i++) {
        const current = sortedHours[i]
        const next = sortedHours[i + 1]

        const formatTime = (h: any) => h.isOpen ? `${h.start} - ${h.end}` : 'Geschlossen'

        if (!next || formatTime(current) !== formatTime(next)) {
            const startDay = days[sortedHours[startDayIdx].dayOfWeek]
            const endDay = days[current.dayOfWeek]
            const label = startDay === endDay ? startDay : `${startDay} - ${endDay}`

            displayGroups.push({
                label: label + ':',
                time: formatTime(current)
            })

            startDayIdx = i + 1
        }
    }

    return (
        <footer className="bg-mauve-900 text-mauve-100/70 py-16 mt-auto border-t border-mauve-700">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
                <div>
                    <div className="inline-block border-2 border-mauve-100/30 p-2 mb-4">
                        <h3 className="text-light-pink font-serif font-bold text-xl tracking-widest uppercase">Maniküre</h3>
                        <h3 className="text-light-pink font-serif font-bold text-xl tracking-widest uppercase">Dresden</h3>
                    </div>
                    <p className="font-serif italic text-lg text-mauve-200">"Minimale Sorgen, maximale Schönheit."</p>
                </div>
                <div>
                    <h3 className="text-white font-serif tracking-widest mb-6 border-b border-mauve-700 pb-2 inline-block">KONTAKT</h3>
                    <p>Hauptstraße 1</p>
                    <p>01067 Dresden</p>
                    <p className="mt-4">info@manikuere-dresden.de</p>
                    <p>+49 351 1234567</p>
                </div>
                <div>
                    <h3 className="text-white font-serif tracking-widest mb-6 border-b border-mauve-700 pb-2 inline-block">ÖFFNUNGSZEITEN</h3>
                    <div className="grid grid-cols-2 max-w-[250px] gap-y-1">
                        {displayGroups.map((g, i) => (
                            <div key={i} className="contents">
                                <span>{g.label}</span>
                                <span>{g.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-mauve-800 text-center text-xs tracking-widest uppercase text-mauve-500">
                &copy; {new Date().getFullYear()} Maniküre-Dresden. Alle Rechte vorbehalten.
            </div>
        </footer>
    )
}
