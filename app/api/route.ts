import { deleteProduct, getProductInfo } from "@/products/add/action"
import { notFound } from "next/navigation";
import fs from "fs/promises"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const cmd = searchParams.get('cmd')
    const id = searchParams.get('id')

    console.log(`cmd:${cmd}, id=${id}`)
    if((cmd == null) || (id == null)) return notFound()

    if(cmd == "pinfo")
    {
        return productInfo(Number(id))
    }
    else if(cmd == "del")
    {
        return removeProduct(Number(id))
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
        console.log(`product > `);

        if(product)
        {
            result.id = product.id
            result.title = product.title
            result.photo = product.photo
            result.price = product.price
            result.userid = product.userId
            result.description = product.description
            result.response = 'ok'  
        }        
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
