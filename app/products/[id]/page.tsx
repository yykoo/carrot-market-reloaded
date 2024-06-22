import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatToWon } from "@/lib/utils";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

async function getIsOwner(userId:number) {
    const session = await getSession()

    if(session.id) {
        return session.id === userId
    }
    return false
}

async function getProduct(id:number) {
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

const getCacheProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail", "all"]
})

async function getProductTitle(id:number) {
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
    const product = await getCacheProduct(id)
    if(!product) {
        return notFound()
    }

    const isOwner = await getIsOwner(product.userId)
    const revalidate = async() => {
        'use server'
        revalidateTag("all")
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
                        <form action={revalidate}>
                            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">Revalidate title</button>
                        </form>
                    ) : null
                }
                <Link className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold" href={``}>채팅하기</Link>
            </div>
        </div>
    )
}