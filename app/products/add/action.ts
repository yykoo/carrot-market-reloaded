"use server"

import { z } from "zod"
import fs from "fs/promises"
import db from "@/lib/db"
import getSession from "@/lib/session"
import { redirect } from "next/navigation"
import { productSchema, productUpdateSchema } from "./schema"
import { describe } from "node:test"

/*
const productSchema = z.object({
    photo: z.string({
        required_error: "photo is required",
    }),
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string({
        required_error: "Description is required",
    }), 
    price: z.coerce.number({
        required_error: "Price is required",
    }),
})
*/

export async function getProductInfo(id:number) {
    const session = await getSession()
    if(!session)    return false;

    const userId = session.id
    if(!userId)    return false;

    const product = await db.product.findUnique({
        where: {
            id,
        }, 
        include: {
            user: {
                select:{
                    id: true,
                }
            }
        },
    })

    if(!product)    return false
    if(product.user.id !== userId) return false

    return product
}

export async function uploadProduct(_: any, formData: FormData) {
    const data = {
        cmd: formData.get('cmd'),
        id: formData.get('id'),
        prePhoto: formData.get("prePhoto"),
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    }

    if(data.photo instanceof File) {
        if(data.photo.name !== "undefined") {
            const photoData = await data.photo.arrayBuffer();
            console.log("byteLength > " + photoData.byteLength)
    
            if(photoData.byteLength > 10)
            {
                try {
                    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData))
                    data.photo = `/${data.photo.name}`
                } catch(error) {
                    data.photo = ""
                }
            }
    
            // 이전 파일이 있으면서 새로 파일을 등록했을 경우
            if(data.photo && data.prePhoto)
            {
                // file delete
                const _path = `./public${data.prePhoto}`
                fs.unlink(_path)
            }
        } else {
            data.photo = ""
        }
    } else {
        data.photo = ""
    }

    let result
    let photoStr = ""

    if(data.cmd === "CREATE")
    {
        result = productSchema.safeParse(data)
        photoStr = result.data?.photo + ''
    } else {
        result = productUpdateSchema.safeParse(data)
        photoStr = data.photo ? data.photo + '' : data.prePhoto + ''
    }
    
    console.log(`photoStr:${photoStr}, data.photo:${data.photo}, prePhoto:${data.prePhoto}`)
    
    if(!result.success) {
        return result.error.flatten()
    }

    const session = await getSession()
    if(session) 
    {
        if(data.cmd === "CREATE") 
        {
            const product = await db.product.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    price: result.data.price,
                    photo: photoStr,
                    user: {
                        connect: {
                            id:session.id
                        }
                    }
                },
                select: {
                    id: true
                }
            })
    
            redirect(`/products/${product.id}`)
        } 
        else if(data.cmd === "UPDATE") 
        {
            const upData = data.photo ? {
                title: result.data.title,
                description: result.data.description,
                price: result.data.price,
                photo: photoStr,
            } : {
                title: result.data.title,
                description: result.data.description,
                price: result.data.price,
            }
            const update = await db.product.update({
                where: {
                    id: Number(data.id),
                    userId: session.id,
                },
                data: upData,
            })

            redirect(`/products/${data.id}`)
        }
    }

    console.log(data)
}