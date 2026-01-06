import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        // Attempt to access the property structurally (TypeScript check essentially)
        // and perform a safe operation
        console.log('Checking SalonSettings model...');

        // We don't want to actually create junk data if we can avoid it, 
        // but the error happens on 'create' invocation validation.
        // Let's try to upsert which also uses 'create' schema.

        const count = await prisma.salonSettings.count();
        console.log(`Current settings count: ${count}`);

        // If count is 0, we can safely create. passing homePageImage
        if (count === 0) {
            await prisma.salonSettings.create({
                data: {
                    openingHours: "{}",
                    homePageImage: "test-url"
                }
            })
            console.log('Successfully created setting with homePageImage');
        } else {
            const first = await prisma.salonSettings.findFirst();
            if (first) {
                await prisma.salonSettings.update({
                    where: { id: first.id },
                    data: {
                        homePageImage: "test-update-url"
                    }
                })
                console.log('Successfully updated setting with homePageImage');
            }
        }

    } catch (e) {
        console.error('Validation Error:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
