'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function updateSalonHeroImage(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    const file = formData.get('image') as File

    if (!file || file.size === 0) {
        return { error: 'No file provided' }
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const relativeUploadDir = `/uploads/site`
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

        // Upsert settings
        const settings = await prisma.salonSettings.findFirst()

        if (settings) {
            await prisma.salonSettings.update({
                where: { id: settings.id },
                data: { homePageImage: publicUrl }
            })
        } else {
            await prisma.salonSettings.create({
                data: {
                    openingHours: "{}", // Default
                    homePageImage: publicUrl
                }
            })
        }

        revalidatePath('/')
        return { success: true, message: 'Startseitenbild aktualisiert' }

    } catch (e: any) {
        console.error('Upload error:', e)
        return { error: `Upload failed: ${e.message}` }
    }
}
