"use server"

import db from "@/lib/db"
import getSession from "@/lib/session"
import { revalidatePath, unstable_cache as nextCache, revalidateTag } from "next/cache"
import { redirect } from "next/navigation";
import { comment } from "postcss";
import { z } from "zod";

export async function likePost(postId:number) {
    await new Promise((r) => setTimeout(r, 10000));
    const session = await getSession()
    try{
        await db.like.create({
            data: {
                postId,
                userId:session.id!,
            }
        })
        //revalidatePath(`/post/${id}`)
        revalidateTag(`like-status-${postId}`)
    }catch(e){}
}

export async function dislikePost(postId:number) {
    await new Promise((r) => setTimeout(r, 10000));
    const session = await getSession()
    try{
        console.log(`dislike > postid:${postId}, userid:${session.id}`)
        await db.like.delete({
            where: {
                id: {
                    postId,
                    userId:session.id!,
                }
            }
        })
        //revalidatePath(`/post/${id}`)
        revalidateTag(`like-status-${postId}`)
    }catch(e){}
}

const commentSchema = z.object({
    response: z.string(),
    comment: z.string({
        required_error: "Title is required",
    }),
    postid: z.number().min(1, {message: "페이지를 다시 로딩해 주세요"}),
    userid: z.number().min(1, {message: "로그인히 필요합니다."}),
})

export async function uploadComment(_: any, formData: FormData) {
    console.log(formData)
    const session = await getSession()
    const data = {
        response: "fail",
        comment: formData.get('comment'),
        postid: Number(formData.get('postid')),
        userid: session.id,
    }

    const result = await commentSchema.spa(data)
    
    if(!result.success)
    {
        console.log(result.error.flatten())
        return result.error.flatten()
    } else {
        const comment = await db.comment.create({
            data: {
                payload: result.data.comment,
                userId: result.data.userid,
                postId: result.data.postid,
            },
            select: {id: true}
        })

        result.data.response = (comment) ? "ok" : "fail"
        redirect(`/posts/${result.data.postid}`)
        //return result
    }
}

export async function getComments(id:number) {
    const comments = await db.comment.findMany({
        where: {
            id,
        }, 
        include: {
            user: {
                select:{
                    username: true,
                    avatar: true,
                }
            }
        }
    })
    return comments
}

export async function delComment(id:number, userId:number) {
    try {
        const ret = await db.comment.delete({
            where: {
                id,
                userId
            }
        })
        return ret ? true : false
    } catch(e) {
        return false
    }
}