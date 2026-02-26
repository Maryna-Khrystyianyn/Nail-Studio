'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

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

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '')
        const filepath = `gallery/${filename}`

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(filepath, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(filepath)

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
        // Extract path from public URL if necessary, but assuming we might need the original path.
        // For simplicity with Supabase, it's better if the 'url' stored is the public URL.
        // To delete, we need the path 'gallery/filename.jpg'
        
        const path = url.split('/uploads/')[1] // Assuming URL format has /uploads/ bucket name

        if (path) {
            const { error: storageError } = await supabase.storage
                .from('uploads')
                .remove([path])
            if (storageError) console.warn("Could not delete from storage:", storageError)
        }

        await prisma.galleryImage.delete({ where: { id } })

        revalidatePath('/admin/gallery')
        revalidatePath('/gallery')
        return { success: true }
    } catch (e) {
        return { error: 'Fehler beim Löschen' }
    }
}
