'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export async function getSalonSettings() {
    return await prisma.salonSettings.findFirst()
}

export async function updateSalonContactInfo(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    const address = formData.get('address') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    try {
        const settings = await prisma.salonSettings.findFirst()

        if (settings) {
            await prisma.salonSettings.update({
                where: { id: settings.id },
                data: { address, email, phone }
            })
        } else {
            await prisma.salonSettings.create({
                data: {
                    openingHours: "{}",
                    address,
                    email,
                    phone
                }
            })
        }

        revalidatePath('/')
        revalidatePath('/admin/settings')
        return { success: true, message: 'Kontaktinformationen aktualisiert' }
    } catch (e: any) {
        console.error('Update error:', e)
        return { error: `Update failed: ${e.message}` }
    }
}

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

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '')
        const filepath = `site/${filename}`

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
