import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updated = await prisma.service.updateMany({
        data: {
            duration: 120
        }
    })
    console.log(`Updated ${updated.count} services to 120 minutes.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
