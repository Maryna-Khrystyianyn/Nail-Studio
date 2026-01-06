'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getOpeningHours() {
    const hours = await prisma.openingHours.findMany({
        orderBy: { dayOfWeek: 'asc' }
    })

    if (hours.length === 0) {
        // Seed default hours
        const defaults = []
        for (let i = 0; i < 7; i++) {
            defaults.push(await prisma.openingHours.create({
                data: {
                    dayOfWeek: i,
                    isOpen: i !== 0, // Closed on Sunday by default
                    start: "09:00",
                    end: "18:00"
                }
            }))
        }
        return defaults
    }

    return hours
}

export async function updateOpeningHours(dayOfWeek: number, data: { isOpen: boolean, start: string, end: string }) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.openingHours.update({
            where: { dayOfWeek },
            data: {
                isOpen: data.isOpen,
                start: data.start,
                end: data.end
            }
        })
        revalidatePath('/admin/settings/hours')
        revalidatePath('/booking')
        revalidatePath('/') // Crucial for footer
        return { success: true }
    } catch (error) {
        console.error("Failed to update opening hours:", error)
        return { error: "Failed to update" }
    }
}
