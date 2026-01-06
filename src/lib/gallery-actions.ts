'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"

export async function getGalleryImages() {
    return await prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function uploadGalleryImage(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    const file = formData.get('image') as File
    const alt = formData.get('alt') as string || ''

    if (!file || file.size === 0) {
        return { error: 'Kein Bild ausgewählt' }
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const relativeUploadDir = `/uploads/gallery`
        const uploadDir = join(process.cwd(), "public", relativeUploadDir)

        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // Ignore
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '')
        const filepath = join(uploadDir, filename)
        const publicUrl = `${relativeUploadDir}/${filename}`

        await writeFile(filepath, buffer)

        await prisma.galleryImage.create({
            data: { url: publicUrl, alt }
        })

        revalidatePath('/admin/gallery')
        revalidatePath('/gallery')
        return { success: true, message: 'Bild hochgeladen' }
    } catch (e) {
        console.error(e)
        return { error: 'Upload fehlgeschlagen' }
    }
}

export async function deleteGalleryImage(id: string, url: string) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.galleryImage.delete({ where: { id } })

        // Try to delete file from disk
        try {
            const filepath = join(process.cwd(), "public", url)
            await unlink(filepath)
        } catch (e) {
            console.warn("Could not delete file from disk:", e)
        }

        revalidatePath('/admin/gallery')
        revalidatePath('/gallery')
        return { success: true }
    } catch (e) {
        return { error: 'Fehler beim Löschen' }
    }
}
