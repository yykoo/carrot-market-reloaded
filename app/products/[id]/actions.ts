import db from "@/lib/db"
import getSession from "@/lib/session"
import { Prisma } from "@prisma/client"

export async function getProduct(id:number) {
    // get인 경우만 cache, cookie나 headers를 사용하는 request도 cache 하지 않음, server action인 경우 cache하지 않음 
    // fetch("https://api.com", {
    //     next: {
    //         revalidate: 10,
    //         tags: ["hello", "all"]
    //     }
    // })

    //await new Promise((resolve) => setTimeout(resolve, 60000));
    const product = await db.product.findUnique({
        where: {
            id,
        }, 
        include: {
            user: {
                select:{
                    username: true,
                    avatar: true,
                }
            }
        },
    })
    console.log('getProduct')
    return product
}

export type TypeProduct = Prisma.PromiseReturnType<typeof getProduct>


export async function getIsOwner(userId:number) {
    const session = await getSession()

    if(session.id) {
        return session.id === userId
    } else 
        return false

    //return false
}

export async function chkAlreadyRoom(id:string) {
    const room = await db.chatRoom.findUnique({
        where: {
            id,
        },
        select: {
            id:true
        }
    })

    return Boolean(room)
}

export async function getProductTitle(id:number) {
    //await new Promise((resolve) => setTimeout(resolve, 60000));
    const product = await db.product.findUnique({
        where: {
            id,
        }, 
        select: {
            title: true,
        },
    })
    console.log('getProductTitle')
    return product
}
