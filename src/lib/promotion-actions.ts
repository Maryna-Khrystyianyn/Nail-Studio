'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPromotions() {
    const now = new Date()
    return await prisma.promotion.findMany({
        orderBy: { validUntil: 'asc' }
    })
}

export async function getActivePromotions() {
    const now = new Date()
    return await prisma.promotion.findMany({
        where: {
            validUntil: { gte: now }
        },
        orderBy: { validUntil: 'asc' }
    })
}

export async function createPromotion(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const description = formData.get('description') as string
    const validFrom = formData.get('validFrom') as string
    const validUntil = formData.get('validUntil') as string

    if (!title || !description || !validFrom || !validUntil) {
        return { error: 'Bitte alle Pflichtfelder ausfüllen' }
    }

    try {
        await prisma.promotion.create({
            data: {
                title,
                subtitle,
                description,
                validFrom: new Date(validFrom),
                validUntil: new Date(validUntil)
            }
        })
        revalidatePath('/admin/promotions')
        revalidatePath('/promotions')
        return { success: true, message: 'Angebot erstellt' }
    } catch (e) {
        console.error(e)
        return { error: 'Fehler beim Erstellen' }
    }
}

export async function deletePromotion(id: string) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.promotion.delete({ where: { id } })
        revalidatePath('/admin/promotions')
        revalidatePath('/promotions')
        return { success: true }
    } catch (e) {
        return { error: 'Fehler beim Löschen' }
    }
}
