import { notFound } from "next/navigation"
import { PostInfo } from "./post-info"
import { PostInfoCommentList } from "./post-info-comment-list"
import { PostInfoCommentAdd } from "./post-info-comment-add"
import getSession from "@/lib/session"
import { PostInfoComment } from "../post-info-comment"

export default async function PostDetail({params,}:{params: {id:string,}}) {
    const id = Number(params.id)

    if(isNaN(id)) {
        return notFound()
    }

    const session = await getSession()
    return (
        <div className="p-5 text-white">
            <PostInfo id={id} />
            {/* <PostInfoComment id={id} uid={Number(session.id)} /> */}
            <PostInfoCommentList id={id} />
            <PostInfoCommentAdd id={id} />
      </div>
    )
}
