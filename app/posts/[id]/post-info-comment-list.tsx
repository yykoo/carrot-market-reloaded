import { CommentDelButton } from "@/components/comment-del-button"
import db from "@/lib/db"
import getSession from "@/lib/session"
import { formatToTimeAgo } from "@/lib/utils"
import Image from "next/image"

async function getComments(postId:number) {
    const comments = await db.comment.findMany({
        where: {
            postId,
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

export async function PostInfoCommentList(props: {id:number}) {
    const id = props.id
    const session = await getSession()
    const comments = await getComments(id)

    return (
        <div className="mt-10 border-t-2">
        {
            comments.map((comment) => (
                <div key={comment.id!} className="mt-12">
                    <div className="flex flex-row items-center gap-3">
                        <Image width={28} height={28} className="size-6 rounded-full"
                            src={comment.user.avatar!} alt={comment.user.username} />
                        <span className="text-sm font-semibold">{comment.user.username}</span>   
                        <span className="text-sm text-gray-500">{formatToTimeAgo(comment.created_at.toString())}</span> 
                        {
                            (session.id! == comment.userId) ? <CommentDelButton cmmtId={comment.id} /> : ''
                        }
                    </div>
                    <div className="m-4">{comment.payload}</div>
                </div>
            ))
            }
        </div>
    )
}