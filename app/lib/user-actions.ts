import { redirect } from "next/navigation"
import getSession from "@/lib/session";
import db from "@/lib/db";
import { boolean } from "zod";

export async function loginProc(uid: number) {
    const session = await getSession()
    session.id = uid 
    await session.save()
    return true
}

/**
 * 
 * @param head github > "git" / sms > "sms"
 * @param github_id 
 * @param username 
 * @param avatar_url 
 */
export async function avoidDupCreateUser(head:string, github_id:string, username:string, avatar_url?:string) {
    // username 검색
    // 없다면 create 
    // 있다면 랜덤 이름 생성
    let flag = true 
    let checkUserName = ''
    let idx = 1

    do {
        if(checkUserName == '')
            checkUserName = username
        else {
            checkUserName = await uniqueName(idx+'', head, username)
            idx++
        }

    } while(await findUserName(checkUserName))

    const newUser = await db.user.create({
        data: {
            github_id:github_id,
            avatar: avatar_url,
            username: checkUserName,
        },
        select: {
            id: true
        }
    })

    return newUser
}

async function findUserName(username:string) {
    let user = await db.user.findUnique({
        where : {
            username
        },
        select : {
            id:true
        }
    })

    return Boolean(user)
}

async function uniqueName(idx:string, head:string, orgname:string) {
    const now = new Date()
    const min = now.getMinutes()
    const sec = now.getSeconds()

    return `$(orgname)-${head}-${min}${sec}-${idx}`
}
