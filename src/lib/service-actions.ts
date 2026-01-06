'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getServices() {
    return await prisma.service.findMany({
        orderBy: { createdAt: 'asc' }
    })
}

export async function createService(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const price = formData.get('price') as string
    const duration = 120 // Standardized to 2 hours

    if (!name || !category || !price) {
        return { error: 'Bitte alle Felder ausfüllen' }
    }

    try {
        await prisma.service.create({
            data: { name, category, price, duration }
        })
        revalidatePath('/admin/services')
        revalidatePath('/booking')
        revalidatePath('/services')
        return { success: true, message: 'Leistung erstellt' }
    } catch (e) {
        console.error(e)
        return { error: 'Fehler beim Erstellen der Leistung' }
    }
}

export async function deleteService(id: string) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.service.delete({ where: { id } })
        revalidatePath('/admin/services')
        revalidatePath('/booking')
        revalidatePath('/services')
        return { success: true }
    } catch (e) {
        return { error: 'Fehler beim Löschen' }
    }
}

export async function updateService(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const price = formData.get('price') as string
    const duration = 120 // Standardized to 2 hours

    try {
        await prisma.service.update({
            where: { id },
            data: { name, category, price, duration }
        })
        revalidatePath('/admin/services')
        revalidatePath('/booking')
        revalidatePath('/services')
        return { success: true, message: 'Leistung aktualisiert' }
    } catch (e) {
        console.error(e)
        return { error: 'Fehler beim Aktualisieren' }
    }
}
