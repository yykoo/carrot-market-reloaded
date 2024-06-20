"use client"

import ModalBackButton from "@/components/modal-back-button";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Modal({params} : {params: {id:string}}) {
    const router = useRouter()
    const onCloseClick = () => {
        router.back()
    }
    return (
        <div className="absolute w-full h-full z-50 
                flex items-center justify-center
                bg-opacity-60
                bg-black left-0 top-0">
            <ModalBackButton />
            <div className="max-w-screen-sm h-1/2 flex justify-center w-full">
                <div className="aspect-square  bg-neutral-700 text-neutral-200  rounded-md flex justify-center items-center">
                    <PhotoIcon className="h-28" />
                </div>
            </div>
        </div>
    );
}
