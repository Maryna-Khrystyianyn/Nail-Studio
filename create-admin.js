
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = 'naildresden@gmail.com'
    const password = '111111'
    const name = 'Admin User'

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name,
                password: hashedPassword,
                role: 'ADMIN',
            },
        })
        console.log(`Admin user created/verified:`)
        console.log(`Email: ${email}`)
        console.log(`Password: ${password}`)
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
