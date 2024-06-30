import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, getProductInfo } from "@/products/add/action"
import { notFound } from "next/navigation";
import fs from "fs/promises"

/* 
export default async function productInfo(req: NextRequest) {
    let productId = 0

    if(req.method === 'GET') {
        const searchParams = req.nextUrl.searchParams
        const productId = searchParams.get("id")
        const result = {'response':'fail'
                        , 'id':0
                        , 'title':''
                        , 'price':0
                        , 'description':''
                        , 'photo':''
                        , 'userid':0}

        if((productId == null) || (productId === "")) {
            console.log("not found id")
        } else {
            const product = await getProductInfo(Number(productId))
            console.log(`product > ${product}`)
        }

        return NextResponse.json(result)
    } else if(req.method === 'POST') {

    }
}
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const cmd = searchParams.get('cmd')
    const id = Number(searchParams.get('id') ? searchParams.get('id') : "0")

    if(cmd == "pinfo")
    {
        productInfo(id)   
    }
    else if(cmd == "del")
    {
        removeProduct(id)
    }
    else 
    {
        return notFound()
    }
}

async function productInfo(id:number) {
    const result = {'response':'fail'
        , 'id':0
        , 'title':''
        , 'price':0
        , 'description':''
        , 'photo':''
        , 'userid':0}

    if(id < 1) {
        console.log("not found id")
    } else {
        const product = await getProductInfo(id)
        console.log(`product > ${product}`)
    }
    
    return Response.json(result)
}

async function removeProduct(id:number) {
    const product = await getProductInfo(id)
    console.log(`product > ${product}`)

    if(product)
    {
        if(product.photo)
        {
            // file delete
            const _path = `./public${product.photo}`
            fs.unlink(_path)
        }
    }

    const result = {'response':'fail'}
    const ret = await deleteProduct(id)

    if(ret) result.response = "ok"
    
    return Response.json(result)
}