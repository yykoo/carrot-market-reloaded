"use client"

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { getProductInfo, uploadProduct } from "./action";
import { useFormState } from "react-dom";
import { notFound, useSearchParams } from "next/navigation";
import { formatToWon } from "@/lib/utils";

export default function AddProduct() {
    console.log("AddProduct")
    const InitialProduct = {'response':'fail'
        , 'id':0
        , 'title':''
        , 'price':0
        , 'description':''
        , 'photo':''
        , 'userid':0}
    type _InitialProduct = typeof InitialProduct
    // interface ProductProps {
    //     initialProducts:_InitialProduct,
    // }

    const params = useSearchParams();
    const [product, setProduct] = useState(InitialProduct)
    const [preview, setPreview] = useState("")
    const [_title, setTitle] = useState("")
    const [_price, setPrice] = useState("0")
    const [_desc, setDesc] = useState("")
    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target: {files}, } = event
        if(!files)  return

        const file = files[0]
        const url = URL.createObjectURL(file)
        setPreview(url)
    }
    const onTitleChange = (Event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(Event.target.value)
    }
    const onPriceChange = (Event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(Event.target.value)
    }
    const onDescChange = (Event: React.ChangeEvent<HTMLInputElement>) => {
        setDesc(Event.target.value)
    }
    const [state, action] = useFormState(uploadProduct, null)
    const getData = () => {
        const url = `/api?id=${params.get('id')}`
        console.log(`url > ${url}`)
        fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const ret = data as _InitialProduct
            console.log(`fetch then`)
            console.dir(ret)
            if(ret !== null)
            {
                console.log(`response:` + ret.response)
                // setProduct({'response':ret.response
                //     , 'id':ret.id
                //     , 'title':ret.title
                //     , 'price':ret.price
                //     , 'description':ret.description
                //     , 'photo':ret.photo
                //     , 'userid':ret.userid})
                setTitle(ret.title)
                setPrice(ret.price + '')
                setDesc(ret.description)
                setPreview(ret.photo)
            }
            return false
        })
    }
    let btnName = "작성 완료"
    let cmd = 'CREATE'
    let pid = params.get('id') ? params.get('id') : ''

    if(pid) 
    {
        getData();
        btnName = "정보 수정"
        cmd = "UPDATE"
    } else {
        console.log(`id is not exists`)
    }

    return (
        <div>
            <form action={action} className="p-5 flex flex-col gap-5">
                <input type='hidden' name='cmd' defaultValue={cmd} />
                <input type='hidden' name='id' defaultValue={pid} />
                <input type='hidden' name='prePhoto' defaultValue={preview} />
                <label
                htmlFor="photo"
                style={{backgroundImage: `url(${preview})`}}
                className="border-2 aspect-square flex items-center justify-center flex-col
                         text-neutral-300 border-neutral-300 rounded-md border-dashed 
                         cursor-pointer bg-center bg-cover">
                {preview === "" ? <>
                        <PhotoIcon className="w-20" />
                        <div className="text-neutral-400 text-sm">
                            사진을 추가해주세요.
                            {state?.fieldErrors.photo}
                        </div>
                    </> : null }
                </label>
                <input
                    onChange={onImageChange}
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                />
                <Input 
                    name="title" 
                    required 
                    placeholder="제목" 
                    type="text" 
                    errors={state?.fieldErrors.title} 
                    defaultValue={_title}
                    onChange={onTitleChange} />
                <Input 
                    name="price" 
                    type="number" 
                    required 
                    placeholder="가격" 
                    errors={state?.fieldErrors.price} 
                    defaultValue={_price}
                    onChange={onPriceChange} />
                <Input
                    name="description"
                    type="text"
                    required
                    placeholder="자세한 설명"
                    errors={state?.fieldErrors.description}
                    defaultValue={_desc} 
                    onChange={onDescChange}
                />
                <Button text={btnName} />
            </form>
        </div>
    )
}
