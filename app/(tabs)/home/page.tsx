import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { title } from "process";

async function getInitialProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        take: 1,
        orderBy: {
            created_at: "desc",
        }
    })
    return products
}

export type InitialProduct = Prisma.PromiseReturnType<typeof getInitialProducts>

export const metadata = {
    title: "Home",
}

export default async function Products() {
    const initialProducts = await getInitialProducts();
    return (
        <div>
            <Link href="/home/recent">Recent Products</Link>
            <ProductList initialProducts={initialProducts} />
            <Link href="/products/add" 
                className="bg-orange-500 flex items-center justify-center text-white 
                rounded-full size-16 fixed bottom-24 right-8 transition-colors hover:bg-orange-400">
                <PlusIcon className="size-10" />
            </Link>
        </div>
    )
}