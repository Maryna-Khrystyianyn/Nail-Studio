import { getOpeningHours } from "@/lib/opening-hours-actions"
import { OpeningHoursManager } from "@/components/admin/OpeningHoursManager"
import Link from "next/link"

export default async function AdminHoursPage() {
    const hours = await getOpeningHours()

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-serif font-bold">Öffnungszeiten</h1>
                    <Link href="/admin" className="text-neutral-400 hover:text-white transition">Back to Dashboard</Link>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-6 mb-8">
                    <p className="text-neutral-400 mb-6">
                        Stellen Sie hier die allgemeinen Öffnungszeiten ein. Sie können pro Tag bis zu zwei Zeitfenster definieren (z.B. Vormittag und Nachmittag).
                        Lassen Sie das zweite Zeitfenster leer, um durchgehend geöffnet zu haben.
                    </p>
                    <OpeningHoursManager hours={hours} />
                </div>
            </div>
        </div>
    )
}
