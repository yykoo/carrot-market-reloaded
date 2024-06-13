"use client"

import { InitialProduct } from "@/(tabs)/products/page";
import ListProduct from "./list-product";
import { useState } from "react";
import { getMoreProducts } from "@/(tabs)/products/actions";

/*
interface ProductProps {
    initialProducts: {id: number;
        title: string;
        price: number;
        photo: string;
        created_at: Date;
    }[]
}
*/
interface ProductProps {
    initialProducts:InitialProduct,
}

export default function ProductList({initialProducts}: ProductProps) {
    const [products, setProducts] = useState(initialProducts)
    const [isLoading, setIsLoading] = useState(false)
    const onLoadMore = async() => {
        setIsLoading(true)
        const newProducts = await getMoreProducts(1)
        setProducts(prev => [...prev, ...newProducts])
        setIsLoading(false)
    }

    return (
        <div className="p-5 flex flex-col gap-5">
            {
                products.map(product => <ListProduct key={product.id} {...product} />)
            }
            <button 
                disabled={isLoading}
                onClick={onLoadMore} 
                className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
            >
                {isLoading ? "로딩중" : "Load more"}
            </button>
        </div>
    )   
}