import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { UserType } from "./types"

import colors from 'colors';
colors.enable();

const createUsers = async (count: number = 10) => {  
  const users: UserType[] = [{
    name: faker.name.fullName(),
    email: "envless.dev@example.com"
  }]

  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.name.fullName(),
      email: faker.internet.email(),
    })
  }

  console.log(`Seeding ${users.length} users`.blue);

  const records = await prisma.user.createMany({
    data: users,
  })

  console.log(`🎉 Seeded ${records.count} users`.green);
  return records;
}

export default createUsers;