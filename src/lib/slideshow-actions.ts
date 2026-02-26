import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

// Fetch all slideshow images ordered by `order`
export async function getSlideshowImages() {
    return await prisma.slideshowImage.findMany({
        orderBy: { order: 'asc' }
    })
}

// Upload a new slideshow image (max 3 images)
export async function uploadSlideshowImage(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    const file = formData.get('image') as File
    if (!file || file.size === 0) {
        return { error: 'No image selected' }
    }

    // Enforce max 3 images
    const existing = await prisma.slideshowImage.count()
    if (existing >= 3) {
        return { error: 'Maximum of 3 slideshow images allowed' }
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '')
        const filepath = `slideshow/${filename}`

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

        // Determine order: place at the end
        const maxOrder = await prisma.slideshowImage.aggregate({
            _max: { order: true }
        })
        const nextOrder = (maxOrder._max?.order ?? -1) + 1

        await prisma.slideshowImage.create({
            data: { url: publicUrl, order: nextOrder }
        })

        revalidatePath('/admin/slideshow')
        revalidatePath('/')
        return { success: true, message: 'Image uploaded' }
    } catch (e) {
        console.error(e)
        return { error: 'Upload failed' }
    }
}

// Delete a slideshow image and re‑order remaining images
export async function deleteSlideshowImage(id: string) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        const image = await prisma.slideshowImage.findUnique({ where: { id } })
        if (!image) return { error: 'Image not found' }

        // Extract path from public URL
        const path = image.url.split('/uploads/')[1]

        if (path) {
            const { error: storageError } = await supabase.storage
                .from('uploads')
                .remove([path])
            if (storageError) console.warn("Could not delete from storage:", storageError)
        }

        await prisma.slideshowImage.delete({ where: { id } })

        // Re‑order remaining images to keep consecutive order values
        const remaining = await prisma.slideshowImage.findMany({
            orderBy: { order: 'asc' }
        })
        for (let i = 0; i < remaining.length; i++) {
            await prisma.slideshowImage.update({
                where: { id: remaining[i].id },
                data: { order: i }
            })
        }

        revalidatePath('/admin/slideshow')
        revalidatePath('/')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: 'Deletion failed' }
    }
}
