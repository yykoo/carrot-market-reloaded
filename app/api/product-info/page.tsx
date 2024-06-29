import { NextRequest, NextResponse } from "next/server";
import { getProductInfo } from "@/products/add/action"
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
    const id = searchParams.get('id')
    const result = {'response':'fail'
        , 'id':0
        , 'title':''
        , 'price':0
        , 'description':''
        , 'photo':''
        , 'userid':0}

    if((id == null) || (id === "")) {
        console.log("not found id")
    } else {
        const product = await getProductInfo(Number(id))
        console.log(`product > ${product}`)
    }
    
    return Response.json(result)
}
