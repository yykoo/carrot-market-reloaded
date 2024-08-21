import db from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function getChatList(id: number) {
    const list = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: {
                        in: [id!],
                    }
                }
            }
        },
        include: {
            messages: {
                select: {
                    payload: true,
                    id: true,
                    created_at: true,
                },
                orderBy: {
                    created_at: "desc",
                }
            },
            users: {
                where: {
                    NOT: {
                        id,
                    }
                }
            }
        }
    })

    return list 
}

export type TypeChatList = Prisma.PromiseReturnType<typeof getChatList>
