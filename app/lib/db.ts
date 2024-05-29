import { PrismaClient } from "@prisma/client"

const db = new PrismaClient();

async function test() {
    const user = await db.user.create({
        data: {
            username:"sd"
        }
    })
}

test()

export default db;

