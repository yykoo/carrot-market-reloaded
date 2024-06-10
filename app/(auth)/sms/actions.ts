"use server"

import { z } from "zod"
import validator from "validator"
import { redirect } from "next/navigation"
import { error } from "console"
import db from "@/lib/db"
import crypto from "crypto"
import { loginProc } from "@/lib/user-actions"
import twilio from "twilio";

const phoneSchema = z
.string()
.trim()
.refine(phone => validator.isMobilePhone(phone, "ko-KR"), "Wrong phone number")

async function tokenExists(token: number) {
    const exists = await db.sMSToken.findUnique({
        where: {
            token: token.toString()
        },
        select: {
            id: true
        }
    })
    return Boolean(exists)
}

const tokenSchema = z.coerce.number().min(100000).max(999999).refine(tokenExists, "This token does not exist.")

interface ActionState {
    token: boolean;
}

async function getToken() {
    const token = crypto.randomInt(100000, 999999).toString()
    const exists = await db.sMSToken.findUnique({
        where: {
            token,
        },
        select: {
            id: true
        }
    })

    if(exists) {
        return getToken()
    } else {
        return token
    }
}

export async function smsLogin(prevState: any, formData: FormData) {
    const phone = formData.get('phone')
    const token = formData.get('token')

    if(!prevState.token) {
        const result = phoneSchema.safeParse(phone)

        if(!result.success) {
            console.log(result.error.flatten())
            return {
                token: false,
                error: result.error.flatten(),
            }
        } else {
            // delete previous token
            await db.sMSToken.deleteMany({
                where: {
                    user: {
                        phone: result.data
                    }
                }
            })
            // create token
            const token = await getToken()
            
            // send the token using twilio
            await db.sMSToken.create({
                data: {
                    token,
                    user: {
                        connectOrCreate: {
                            where : {
                                phone: result.data,
                            },
                            create : {
                                username: crypto.randomBytes(10).toString("hex"),
                                phone : result.data,
                            },
                        }
                        // connect: {
                        //     phone: result.data
                        // }
                    }
                }
            })

            // twilio section 
            const client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
              );
              await client.messages.create({
                body: `Your Karrot verification code is: ${token}`,
                from: process.env.TWILIO_PHONE_NUMBER!,
                to: result.data
                //to: process.env.MY_PHONE_NUMBER!,
              });

            return {
                token: true
            }
        }
    } else {
        const result = await tokenSchema.spa(token)

        if(!result.success) {
            return {
                token:true,
                error:result.error.flatten()
            }
        } else {
            // get the userId of token 
            const token = await db.sMSToken.findUnique({
                where: {
                    token: result.data.toString()
                },
                select: {
                    id: true,
                    userId: true,
                }
            })
            
            if(token) {
                await db.sMSToken.delete({
                    where: {
                        id: token.id
                    }
                })
                console.log("is tokened")
                await loginProc(token.userId)
                redirect("/profile")
            }
            // log the user in 
            //redirect("/")
        }
    }
}