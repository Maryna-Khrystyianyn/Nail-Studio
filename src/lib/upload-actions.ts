'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"

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

        // Remove from filesystem
        const filepath = join(process.cwd(), "public", photo.url)
        try {
            await unlink(filepath)
        } catch (e) {
            console.error("File deletion error", e)
            // Continue anyway to delete DB record
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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure directory exists
    const relativeUploadDir = `/uploads/${userId}`
    const uploadDir = join(process.cwd(), "public", relativeUploadDir)

    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore if exists
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '')
    const filepath = join(uploadDir, filename)
    const publicUrl = `${relativeUploadDir}/${filename}`

    try {
        await writeFile(filepath, buffer)

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
