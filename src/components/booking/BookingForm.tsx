'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { createBooking, getAvailableSlots } from '@/lib/booking-actions'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button disabled={pending} type="submit" className="btn-primary w-full mt-6">
            {pending ? 'Wird gebucht...' : 'Termin bestätigen'}
        </button>
    )
}

export default function BookingForm({ user, services = [] }: { user?: any, services?: any[] }) {
    const [step, setStep] = useState(1)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Form State
    const [serviceId, setServiceId] = useState('')
    // We store the full service name+price string for display/email logic as before, or refactor to use ID.
    // For minimal refactor, let's keep 'service' as the string value but look it up.
    // Actually, let's store the Service Object or constructed string.
    const [selectedService, setSelectedService] = useState<any>(null)

    // Derived state for the backend
    const serviceName = selectedService ? `${selectedService.name} (${selectedService.price})` : ''

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [slots, setSlots] = useState<string[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    // Fetch slots when date or service changes
    useEffect(() => {
        if (date) {
            setLoadingSlots(true)
            getAvailableSlots(date, selectedService?.id).then(s => {
                setSlots(s)
                setLoadingSlots(false)
            })
        }
    }, [date, selectedService])

    async function clientAction(formData: FormData) {
        // We need to pass the service string expected by backend
        formData.set('service', serviceName)

        const res = await createBooking(null, formData)
        if (res?.error) {
            setError(res.error)
        } else {
            setSuccess(true)
        }
    }

    if (success) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-green-500 mb-4">Buchung bestätigt!</h2>
                <p className="text-neutral-400">Vielen Dank für Ihre Terminvereinbarung.</p>
                <p className="mt-4"><a href="/dashboard" className="text-pink-500 underline">Zum Dashboard</a></p>
            </div>
        )
    }

    const groupedServices = services.reduce((acc: any, s: any) => {
        if (!acc[s.category]) acc[s.category] = []
        acc[s.category].push(s)
        return acc
    }, {})

    return (
        <form action={clientAction}>
            {/* Hidden inputs to pass state to server action */}
            {/* Service is set via formData manipulation above or hidden input */}
            <input type="hidden" name="date" value={date} />
            <input type="hidden" name="time" value={time} />

            {/* Steps Indicator */}
            <div className="flex mb-8 bg-mauve-700 p-3  justify-between text-sm font-medium text-mauve">
                <span className={step >= 1 ? 'text-light-pink' : ''}>1. Leistung</span>
                <span className={step >= 2 ? 'text-light-pink' : ''}>2. Datum & Zeit</span>
                <span className={step >= 3 ? 'text-light-pink' : ''}>3. Details</span>
            </div>

            {step === 1 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4 text-mauve-700">Wählen Sie eine Leistung</h3>

                    {Object.keys(groupedServices).map(category => (
                        <div key={category} className="mb-6">
                            <p className="text-pink-400 font-bold mb-3 uppercase text-xl italic tracking-wider">{category === 'Manicure' ? 'Maniküre' : category === 'Pedicure' ? 'Pediküre' : 'Sonstiges'}</p>
                            <div className="grid grid-cols-1 gap-3">
                                {groupedServices[category].map((s: any) => (
                                    <label key={s.id} className={`flex justify-between items-center p-4 border rounded-sm cursor-pointer transition ${selectedService?.id === s.id ? 'border-pink-500 bg-pink-900/20 font-bold' : 'border-neutral-700 hover:bg-mauve-700 hover:text-white text-mauve-700'}`}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="service_id"
                                                value={s.id}
                                                checked={selectedService?.id === s.id}
                                                onChange={() => setSelectedService(s)}
                                                className="mr-3 accent-pink-600"
                                            />
                                            <span>{s.name}</span>
                                        </div>
                                        <span className="font-bold text-pink-500">{s.price}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        disabled={!selectedService}
                        onClick={() => setStep(2)}
                        className="btn-primary w-full mt-4"
                    >
                        Weiter
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4 text-white">Datum & Uhrzeit wählen</h3>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-400">Datum</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="input-field" // Uses our new dark mode input style
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {date && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-400">Verfügbare Zeiten</label>
                            {loadingSlots ? (
                                <p className="text-sm text-neutral-500">Lade Zeiten...</p>
                            ) : slots.length === 0 ? (
                                <p className="text-sm text-red-500">Keine Termine an diesem Tag verfügbar.</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {slots.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setTime(s)}
                                            className={`py-2 text-sm rounded-sm border transition ${time === s ? 'bg-pink-600 text-white border-pink-600' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button type="button" onClick={() => setStep(1)} className="btn-outline w-1/2">Zurück</button>
                        <button
                            type="button"
                            disabled={!date || !time}
                            onClick={() => setStep(3)}
                            className="btn-primary w-1/2"
                        >
                            Weiter
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    <div className="bg-neutral-800 p-4 rounded-sm text-sm mb-6 text-neutral-300 border border-neutral-700">
                        <p><span className="font-bold text-white">Leistung:</span> {serviceName}</p>
                        <p><span className="font-bold text-white">Wann:</span> {date} um {time}</p>
                    </div>

                    {user ? (
                        <div className="mb-4 text-sm text-neutral-400">
                            Buchung als <span className="font-bold text-white">{user.name}</span> ({user.email})
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-300">Name</label>
                                <input name="name" type="text" required className="input-field" placeholder="Max Mustermann" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-300">Email</label>
                                <input name="email" type="email" required className="input-field" placeholder="max@beispiel.de" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-300">Telefon</label>
                                <input name="phone" type="tel" required className="input-field" placeholder="+49..." />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold mb-1 text-neutral-300">Kommentare & Wünsche</label>
                        <textarea name="comments" className="input-field h-24" placeholder="Besondere Designwünsche oder Allergien?"></textarea>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex gap-4">
                        <button type="button" onClick={() => setStep(2)} className="btn-outline w-1/2">Zurück</button>
                        <div className="w-1/2">
                            <SubmitButton />
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}
