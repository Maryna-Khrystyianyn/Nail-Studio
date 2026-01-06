'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"

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
