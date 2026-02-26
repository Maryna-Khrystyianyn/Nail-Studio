import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session) return { error: 'Not authenticated' }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string
    const avatar = formData.get('avatar') as File

    const dataToUpdate: any = {}

    if (name) dataToUpdate.name = name
    if (email) dataToUpdate.email = email
    if (phone) dataToUpdate.phoneNumber = phone

    // Password Update
    if (password && password.trim() !== '') {
        if (password.length < 6) return { error: 'Password must be at least 6 characters' }
        dataToUpdate.password = await bcrypt.hash(password, 10)
    }

    // Avatar Update
    if (avatar && avatar.size > 0) {
        try {
            const bytes = await avatar.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const filename = `${session.user.id}-${uniqueSuffix}-${avatar.name.replace(/[^a-zA-Z0-9.]/g, '')}`
            const filepath = `avatars/${filename}`

            const { data, error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(filepath, buffer, {
                    contentType: avatar.type,
                    upsert: true
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(filepath)

            dataToUpdate.image = publicUrl
        } catch (e) {
            console.error(e)
            return { error: 'Failed to upload avatar' }
        }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: dataToUpdate
        })

        revalidatePath('/dashboard')
        revalidatePath('/admin')
        return { success: true, message: 'Profil erfolgreich aktualisiert' }
    } catch (e) {
        console.error(e)
        return { error: 'Update failed' }
    }
}
