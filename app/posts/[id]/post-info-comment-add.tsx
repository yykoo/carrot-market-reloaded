"use client"

import { useFormState } from "react-dom"
import { uploadComment } from "./actions"
import { useEffect, useState } from "react"

export async function PostInfoCommentAdd(props:{id:number}) {
    const id = props.id
    const [state, action] = useFormState(uploadComment, null)
    // useEffect(() => {
    //     if(state)
    //     {
    //         console.log(`state is not null`)
    //     } else {
    //         console.log(`state is null`)
    //     }        
    // }, [state])
    
    return (
        <div className="mt-10 border-t-2 pt-10">
            <form action={action}>
                <input type="hidden" name='postid' value={id} />
                <textarea 
                    name='comment'
                    className="w-full bg-gray-500 text-neutral-100 rounded-lg" 
                    required 
                />
                <button type='submit' className="bg-slate-300 w-36 h-8 rounded-md float-end text-cyan-900">등록</button>
            </form>
        </div>
    )
}
