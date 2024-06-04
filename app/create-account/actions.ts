"use server"

import bcrypt from "bcrypt"
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants"
import db from "@/lib/db"
import {z} from "zod"
import { redirect } from 'next/navigation'
import getSession from "@/lib/session"

const checkUserName = (username:string) => !username.includes("potato")
const checkPasswd = ({passwd, confirm_passwd}:{passwd:string, confirm_passwd:string}) => passwd === confirm_passwd
const checkUniqueUsername = async (username:string) => {
    const user = await db.user.findUnique({
        where: {username: username,},
        select: {id: true,}
    })
    return !Boolean(user)
}
const checkUniqueEmail = async (email:string) => {
    const user = await db.user.findUnique({
        where: {email},
        select: { id: true,}
    }) 
    return !Boolean(user)
}
const formSchema = z.object({
    username: z.string({
        invalid_type_error: "username은 문자로 입력해 주세요",
        required_error: "username을 입력해 주세요"
    })
    .toLowerCase()
    .trim()
    .transform((username) => `${username}`)
    .refine(checkUserName, "potato는 안되요."),
    email: z.string()
        .email()
        .trim(),
    passwd: z.string()
        .min(PASSWORD_MIN_LENGTH)
        .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_passwd: z.string()
        .min(PASSWORD_MIN_LENGTH),
}).superRefine(async ({username}, ctx) => {
    const user = await db.user.findUnique({
        where: {
            username
        },
        select: {
            id: true
        }
    })
    if(user) {
        ctx.addIssue({
            code: "custom",
            message: "This username is already taken",
            path: ["username"],
            fatal: true,
        })
        return z.NEVER
    }
}).superRefine(async ({email}, ctx) => {
    const user = await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true
        }
    })
    if(user) {
        ctx.addIssue({
            code: "custom",
            message: "This email is already taken",
            path: ["email"],
            fatal: true,
        })
        return z.NEVER
    }    
}).refine(checkPasswd, {
    message: "비밀번호가 일치하지 않아요",
    path: ["confirm_passwd"]    
})

export async function createAccount(prevState:any, formData:FormData) {
    const data = {
        username: formData.get("username"),
        email : formData.get("email"),
        passwd: formData.get("passwd"),
        confirm_passwd: formData.get("confirm_passwd"),
    }
    const result = await formSchema.spa(data)

    if(!result.success)
    {
        console.log(result.error.flatten())
        return result.error.flatten()
    } else {
        const hashedPassword = await bcrypt.hash(result.data.passwd, 6)
        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {id: true}
        })
        const session = await getSession();
        session.id = user.id 
        await session.save()
        redirect("/profile");
    }
}