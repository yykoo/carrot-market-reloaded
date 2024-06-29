import { z } from "zod";

export const productSchema = z.object({
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

export const productUpdateSchema = z.object({
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

export type ProductType = z.infer<typeof productSchema>
