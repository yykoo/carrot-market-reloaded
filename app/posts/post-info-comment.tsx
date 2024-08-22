"use client"

import { CommentDelButton } from "@/components/comment-del-button"
import { InitialComment } from "@/lib/db"
import { formatToTimeAgo } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"


export async function PostInfoComment(props: {id:number, uid:number}) {
    /*
    const id = props.id
    const uid = props.uid

    const [comments, setComments] = useState<[InitialComment]>()

    function resetList(list?:any)
    {
        setComments(list)
    }

    function LoadComments(id:number) {
        const url = `/api?cmd=cmdlist&id=${id}`
        console.log(` >> ` + url)

        try {
            fetch(url)
            .then((response) => { response.json() })
            .then((data) => {
                console.log(data)
                resetList(data)
                return data
            })
        } catch(err) {
            return null
        }
    }

    LoadComments(id)
    
    return (
        <>
            <div className="mt-10 border-t-2">
            {
                comments?.map((comment) => (
                    <div key={comment.id} className="mt-12">
                        <div className="flex flex-row items-center gap-3">
                            <Image width={28} height={28} className="size-6 rounded-full"
                                src={comment?.user.avatar!} alt={comment.user.username} />
                            <span className="text-sm font-semibold">{comment.user.username}</span>   
                            <span className="text-sm text-gray-500">{formatToTimeAgo(comment.created_at.toString())}</span> 
                            {
                                (uid! == comment.userId) ? <CommentDelButton cmmtId={comment.id} /> : ''
                            }
                        </div>
                        <div className="m-4">{comment.payload}</div>
                    </div>
                ))
                }
            </div>
            <div key={id} className="mt-10 border-t-2 pt-10">
                <form>
                    <input type="hidden" name='postid' defaultValue={id} value={id} />
                    <textarea 
                        name='comment'
                        className="w-full bg-gray-500 text-neutral-100 rounded-lg" 
                        required 
                    />
                    <span className="text-red-500 font-medium"></span>
                    <button type='submit' className="bg-slate-300 w-36 h-8 rounded-md float-end text-cyan-900">등록</button>
                </form>
            </div>
        </>
    )
    */
   return (
    <div>Post Innfo Comment</div>
   )
}
