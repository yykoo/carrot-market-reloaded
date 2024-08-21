import db from "@/lib/db"
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
