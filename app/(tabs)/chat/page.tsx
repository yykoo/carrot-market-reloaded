import db from "@/lib/db"
import getSession from "@/lib/session"
import { notFound } from "next/navigation"

// export async function getChatList(userId: number) {
//     const list = await db.message.groupBy({
//         by: [`chatRoomId`],
//         where: {
//             userId
//         }
//     })
// }

export default async function Chat() {
    // const session = await getSession()

    // if(!session.id)
    // {
    //     return notFound()
    // }


    return (
        <div>
            <h1 className="">Chat</h1>
        </div>
    )
}
