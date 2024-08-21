import db from "@/lib/db"
import getSession from "@/lib/session"
import { notFound } from "next/navigation"
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";
import { getChatList } from "./actions";

export default async function Chat() {
    const session = await getSession()

    if(!session.id)
    {
        return notFound()
    }

    const list = await getChatList(session.id)
    console.log(list)

    return (
        <div>
            <h1 className="">Chat</h1>
            {
                list.map((chat) => (
                    <div key={chat.id!} className="flex gap-5 w-full py-4 px-4 rounded-xl bg-base-100 shadow-xl">
                        <div className="flex justify-center items-center gap-4">
                        {
                            chat.users[0]?.avatar ? (
                                <Image
                                    src={chat.users[0].avatar}
                                    alt={chat.users[0].username}
                                    width={50}
                                    height={50}
                                    className="size-8 rounded-full" />
                            ) : (
                                <div className="size-8 rounded-full bg-slate-400"></div>
                            )
                        }
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-xl text-white text-xs">
                                {chat.users[0].username}
                            </div>
                            <span className="bg-orange-500 p-2.5 rounded-md">
                                <Link key={chat.id} href={`/chats/${chat.id}`} className="text-white">
                                    {chat.messages[0]?.payload}
                                </Link>
                            </span>
                            <span className="text-xs">
                                {formatToTimeAgo(chat.messages[0]?.created_at.toString())}
                            </span>
                        </div>
                    </div> 
                ))
            }          
        </div>
    )
}
