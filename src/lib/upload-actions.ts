'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export async function deleteUserPhoto(photoId: string, userId: string) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        const photo = await prisma.userPhoto.findUnique({
            where: { id: photoId }
        })

        if (!photo) return { error: 'Photo not found' }

        // Remove from storage
        const path = photo.url.split('/uploads/')[1]
        
        if (path) {
            const { error: storageError } = await supabase.storage
                .from('uploads')
                .remove([path])
            if (storageError) console.warn("Could not delete from storage:", storageError)
        }

        // Remove from DB
        await prisma.userPhoto.delete({
            where: { id: photoId }
        })

        revalidatePath(`/admin/users/${userId}`)
        revalidatePath(`/dashboard`)
        return { success: true }
    } catch (e) {
        console.error("Deletion error", e)
        return { error: 'Failed to delete photo' }
    }
}

export async function uploadUserPhoto(formData: FormData) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    const file = formData.get('photo') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
        return { error: 'Missing file or user ID' }
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '')
        const filepath = `${userId}/${filename}`

        const { data, error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(filepath, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(filepath)

        await prisma.userPhoto.create({
            data: {
                userId,
                url: publicUrl
            }
        })

        revalidatePath(`/admin`)
        revalidatePath(`/dashboard`)
        return { success: true }
    } catch (e) {
        console.error("Upload error", e)
        return { error: 'Failed to upload' }
    }
}
