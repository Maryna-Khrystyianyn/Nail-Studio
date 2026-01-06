import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding services...')

    const services = [
        // Manicure
        { name: 'Klassische Maniküre', category: 'Manicure', price: '25 €', duration: 45 },
        { name: 'Maniküre + Gel-Lack', category: 'Manicure', price: '50 €', duration: 90 },
        { name: 'Nur Gel-Lack (ohne Maniküre)', category: 'Manicure', price: '25 €', duration: 45 },
        { name: 'Nagelverlängerung', category: 'Manicure', price: '60-70 €', duration: 120 },
        { name: 'Designs', category: 'Manicure', price: '5 €', duration: 15 },

        // Pedicure
        { name: 'Klassische Pediküre', category: 'Pedicure', price: '40 €', duration: 60 },
        { name: 'Pediküre + Gel-Lack', category: 'Pedicure', price: '60 €', duration: 90 },
        { name: 'Express-Pediküre (Nur Zehen + Gel-Lack)', category: 'Pedicure', price: '40 €', duration: 45 },

        // Other (Placeholder)
        // { name: 'Beispiel', category: 'Other', price: '0 €', duration: 30 }
    ]

    for (const s of services) {
        await prisma.service.create({ data: s })
    }

    console.log('Services seeded!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
