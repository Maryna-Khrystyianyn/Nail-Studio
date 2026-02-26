'use client'

import { getOpeningHours } from "@/lib/opening-hours-actions"
import { getSalonSettings } from "@/lib/settings-actions"
import { useTranslations, useLocale } from 'next-intl'
import Link from "next/link"
import { useEffect, useState } from 'react'

export function Footer() {
    const t = useTranslations('Footer')
    const locale = useLocale()
    const [hours, setHours] = useState<{ dayOfWeek: number, isOpen: boolean, start: string, end: string }[]>([])
    const [settings, setSettings] = useState<any>(null)

    useEffect(() => {
        getOpeningHours().then(setHours)
        getSalonSettings().then((res) => {
            if (res) setSettings(res)
        })
    }, [])

    // Helper to format hours for display
    const daysMap: Record<string, string[]> = {
        'de': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        'en': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        'uk': ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    }
    const days = daysMap[locale] || daysMap['de']

    const sortedHours = hours.length > 0 
        ? [...hours.filter((h) => h.dayOfWeek !== 0), hours.find((h) => h.dayOfWeek === 0)].filter((h): h is NonNullable<typeof h> => !!h)
        : []

    const displayGroups: { label: string, time: string }[] = []

    let startDayIdx = 0

    const formatTime = (h: { isOpen: boolean, start: string, end: string }) => 
        h.isOpen ? `${h.start} - ${h.end}` : t('closed')

    for (let i = 0; i < sortedHours.length; i++) {
        const current = sortedHours[i]
        const next = sortedHours[i + 1]

        if (!next || formatTime(current) !== formatTime(next)) {
            const startDayConfig = sortedHours[startDayIdx]
            
            if (startDayConfig) {
                const startDay = days[startDayConfig.dayOfWeek]
                const endDay = days[current.dayOfWeek]
                const label = startDay === endDay ? startDay : `${startDay} - ${endDay}`

                displayGroups.push({
                    label: label + ':',
                    time: formatTime(current)
                })
            }

            startDayIdx = i + 1
        }
    }

    return (
        <footer className="bg-mauve-900 text-pink-200 py-16 mt-auto border-t border-mauve-700">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
                <div>
                    <div className="inline-block border-2 border-mauve-100/30 p-2 mb-4">
                        <h3 className="text-light-pink font-serif font-bold text-xl tracking-widest uppercase">{t('title1')}</h3>
                        <h3 className="text-light-pink font-serif font-bold text-xl tracking-widest uppercase">{t('title2')}</h3>
                    </div>
                    <p className="font-serif italic text-lg text-mauve-200">"{t('motto')}"</p>
                </div>
                <div>
                    <h3 className="text-white font-serif tracking-widest mb-6 border-b border-mauve-700 pb-2 inline-block">{t('contact')}</h3>
                    <p>{settings?.address || 'Hauptstraße 1, 01067 Dresden'}</p>
                    <p className="mt-4">{settings?.email || 'info@manikuere-dresden.de'}</p>
                    <p>{settings?.phone || '+49 351 1234567'}</p>
                </div>
                <div>
                    <h3 className="text-white font-serif tracking-widest mb-6 border-b border-mauve-700 pb-2 inline-block">{t('openingHours')}</h3>
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
            <div className="container text-mauve-700 mx-auto px-4 mt-12 pt-8 border-t border-mauve-800 text-center text-xs tracking-widest uppercase">
                &copy; {new Date().getFullYear()}  <Link
            href="https://portfolio-next-js-mu-wheat.vercel.app/"
            className="hover:text-light-pink transition"
          >Maryna Khrystyianyn</Link> {t('rights')} 
            </div>
        </footer>
    )
}
