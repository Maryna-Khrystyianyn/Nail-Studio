'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getSlideshowImages } from '@/lib/slideshow-actions'

export function Slideshow() {
    const [images, setImages] = useState<any[]>([])
    const [current, setCurrent] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const imgs = await getSlideshowImages()
                setImages(imgs)
            } catch (e) {
                console.error("Failed to load slideshow", e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    useEffect(() => {
        if (images.length <= 1) return
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [images])

    if (loading) return <div className="w-full h-full bg-mauve-900/10 animate-pulse" />

    if (images.length === 0) {
        return (
            <div className="relative w-full h-full">
                <Image
                    src="https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=2070"
                    alt="Salon Hero Default"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        )
    }

    return (
        <div className="relative w-full h-full overflow-hidden">
            {images.map((img, idx) => (
                <div
                    key={img.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Image
                        src={img.url}
                        alt="Salon slideshow"
                        fill
                        className="object-cover"
                        priority={idx === 0}
                    />
                </div>
            ))}
        </div>
    )
}
