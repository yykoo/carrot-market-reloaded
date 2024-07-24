import Image from "next/image"
import { notFound } from "next/navigation"
import { unstable_cache as nextCache } from "next/cache"
import db from "@/lib/db"
import { formatToTimeAgo } from "@/lib/utils"
import { EyeIcon } from "@heroicons/react/24/solid"
import LikeButton from "@/components/like-button"
import getSession from "@/lib/session"

async function getPost(id:number) {
    //const post = await db.post.findUnique({
    try {
        const post = await db.post.update({
            where: {
                id,
            },
            data: {
                views: {
                    increment: 1,
                }
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    }
                },
                _count: {
                    select: {
                        comments:true,
                        // likes:true,
                    }
                }
            }
        })
        return post
    } catch (e) {
        return null
    }
}

async function getLikeStatus(postId:number, userId:number) {
    //const session = await getSession()
    const isliked = await db.like.findUnique({
        where: {
            id: {
                postId,
                // userId: session.id!
                userId
            }
        }
    })
    // return Boolean(like)
    const likeCount = await db.like.count({
        where: {
            postId
        }
    })
    return {
        likeCount, isLiked:Boolean(isliked),
    }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {tags:["post-detail"], revalidate:10})
async function getCachedLikeStatus(postId:number) {
    const session =await getSession()
    const userId = session.id!
    const cached = nextCache(getLikeStatus, ["product-like-status"], {tags:[`like-status-${postId}`]})
    return cached(postId, userId)
}

export async function PostInfo(props: {id:number}) {
    const id = props.id
    const post = await getCachedPost(id)
    if(!post) {
        return notFound()
    }
    const {likeCount, isLiked} = await getCachedLikeStatus(id)
    
    return (
        <>
            <div className="flex items-center gap-2 mb-2">
                <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={post.user.avatar!}
                    alt={post.user.username}
                />
                <div>
                    <span className="text-sm font-semibold">{post.user.username}</span>
                    <div className="text-xs">
                    <span>{formatToTimeAgo(post.created_at.toString())}</span>
                    </div>
                </div>
            </div>            
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mb-5">{post.description}</p>
            <div className="flex flex-col gap-5 items-start">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <EyeIcon className="size-5" />
                    <span>조회 {post.views}</span>
                </div>
                <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
            </div>
        </>
    )
}
