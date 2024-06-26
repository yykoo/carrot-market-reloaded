import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

async function getUser() {
    const session = await getSession()
    if(session.id) {
        const user = await db.user.findUnique({
            where: {
                id:session.id,
            }
        })
        if(user)    return user
    }
    notFound()
}

async function UserName()
{
    const user = await getUser();
    return <h1>welcome to {user?.username}</h1>
}

export default async function Profile() { 
    
    const logOut = async () => {
        "use server"
        const session = await getSession()
        await session.destroy()
        redirect("/")
    }
    /**
     * button에 onclick을 넣으면 그건 client side가 됨
     * form에 action을 넣으면 server side가 됨
     */
    return (
        <div>
            <Suspense fallback={"Hello"}>
                <UserName />
            </Suspense>
            <form action={logOut}>
                <button>Log out</button>
            </form>
        </div>
    )
}