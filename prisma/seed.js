const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('Password123!', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@siteflow.app' },
    update: {},
    create: {
      email: 'admin@siteflow.app',
      password,
      role: 'ADMIN',
    },
  })

  console.log('Seeded user:', user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })