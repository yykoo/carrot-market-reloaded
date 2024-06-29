import ModalBackButton from "@/components/modal-back-button";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import Image from "next/image";
import db from "@/lib/db";

async function getProduct(id: number) {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    return product;
}

export default async function Modal({params} : {params: {id:string}}) {
    const id = Number(params.id);
    const product = await getProduct(id);
    if (!product) {
      return notFound();
    }
    
    //console.log(product.photo)
    return (
        <div className="absolute w-full h-full z-50 
                flex items-center justify-center
                bg-opacity-60
                bg-black left-0 top-0">
            <ModalBackButton />
            <div className="max-w-screen-sm h-1/2 flex justify-center w-full">
                <div className="aspect-square
                                bg-neutral-700
                                text-neutral-200 
                                rounded-md flex
                                justify-center
                                items-center">
                {
                    product.photo !== "" ?  
                        <Image
                            fill
                            src={product.photo}
                            alt={product.title}
                            className='object-contain rounded overflow-hidden'
                        /> 
                        : 
                        <PhotoIcon className="h-28" />
                }                    
                </div>
            </div>
        </div>
    );
}
