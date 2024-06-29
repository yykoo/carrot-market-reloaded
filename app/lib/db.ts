import { PrismaClient } from "@prisma/client"

const db = new PrismaClient();
/* 
async function test() {
    const token = await db.sMSToken.create({
        data: {
            token: "223123s2",
            user:{
                connect:{
                    id:1,
                },
            },
        },
    })
    console.log(token)
}
 */
/* async function test2() {
    const token = await db.sMSToken.findUnique({
        where: {
            id:1
        },
        include: {
            user:true
        }
    })
    console.log(token)
} */

//test()
//test2()

// async function test() {
//     const user = await db.user.create({
//         data: {
//             username:"sd"
//         }
//     })
// }

export default db;

