import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatToWon } from "@/lib/utils";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import DelBtn from "@/components/delBtn";
import { Prisma } from "@prisma/client";
import { chkAlreadyRoom, getIsOwner, getProduct, getProductTitle, TypeProduct } from "./actions";

const getCacheProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail", "all"]
})

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
    tags: ["product-title", "all"]
})

export async function generateMetadata({params,}:{params: {id:string}}) {
    const product = await getCachedProductTitle(Number(params.id))
    return {
        title: product?.title,
    }
}

export default async function ProductDetail({params,}:{params: {id:string}}) {
    const id = Number(params.id)
    if(isNaN(id)) {
        return notFound()
    }
    const product = await getCacheProduct(id) as TypeProduct
    if(!product) {
        return notFound()
    }

    const isOwner = await getIsOwner(product.userId)
    // const revalidate = async() => {
    //     'use server'
    //     revalidateTag("all")
    // }
    const UpdateLink = isOwner ? `/products/add?id=${id}` : ''
    const createChatRoom = async() => {
        "use server"

        const session = await getSession()
        // 로그인 상태 아니라면 패스
        if(!session.id) return
        // 내 상품이라면 패스
        if(isOwner) return

        /**
         * product + userid 
         */
        const _chat_id = `${id}-${session.id!}`
        const cRoom = await chkAlreadyRoom(_chat_id)

        if(cRoom) 
        {
            redirect(`/chats/${_chat_id}`)
        } else {
            const room = await db.chatRoom.create({
                data: {
                    id: _chat_id,
                    users: {
                        connect: [
                            {id:product.userId},
                            {id:session.id}
                        ]
                    }
                },
                select: {
                    id: true
                }
            })
            redirect(`/chats/${room.id}`)
        }
    }

    return (
        <div>
            <div className="relative aspect-square">
                <Image fill className="object-cover" src={product.photo} alt={product.title} />
            </div>
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 overflow-hidden rounded-full">
                    {product.user.avatar !== null ? <Image className="w-full h-10 object-cover" src={product.user.avatar} width={40} height={40} alt={product.user.username} /> : 
                    <UserIcon />}
                </div>
                <div>
                    <h3>{product.user.username}</h3>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p>{product.description}</p>
            </div>
            <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
                <span className="font-semibold text-lg">{formatToWon(product.price)}원</span>
                {
                    isOwner ? (
                        // <form action={revalidate}>
                        //     <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">Revalidate title</button>
                        // </form>
                        <>
                            <Link href={UpdateLink}>
                                <button 
                                    className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
                                    Update
                                </button>
                            </Link>
                            <DelBtn pid={params.id} />
                        </>
                    ) : null
                }
                <form action={createChatRoom}>
                    <button className="bg-green-600 px-5 py-2.5 rounded-md text-white font-semibold">
                    채팅하기
                    </button>
                </form>
            </div>
        </div>
    )
}

/**
 * dynamicParams == true 일때 static 하게 미리 생성된 페이지가 아니라면 DB에서 데이터를 가져와 보여주고 페이지를 생성한다. (default)
 * dynamicParams == false 일때 static 하게 미리 생성된 페이지가 아니라면 에러를 리턴한다.
 */
export const dynamicParams = true

export async function generateStaticParams() {
    const products = await db.product.findMany({
        select: {
            id: true,
        }
    })

    return products.map((product) => {id:product.id + ""})
//    return [
//     {id:"1"},{id:"2"},{id:"3"},{id:"4"},
//    ] 
}