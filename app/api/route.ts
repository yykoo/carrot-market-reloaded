import { getProductInfo } from "@/products/add/action"

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
        console.log("api > not found id")
    } else {
        const product = await getProductInfo(Number(id))

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

        console.log(`api > product >> ${result}`)
    }
    
    return Response.json(result)
}
