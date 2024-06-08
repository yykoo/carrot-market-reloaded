import db from "@/lib/db";
import getSession from "@/lib/session";
import { avoidDupCreateUser, loginProc } from "@/lib/user-actions";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

async function getAccessToken(code:string) {

}

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code")
    if(!code) {
        return new Response(null, {
            status: 400,
        })
    }

    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString()
    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`
    const accessTokenResponse = await fetch(accessTokenURL, {
        method:"POST",
        headers: {
            Accept: "application/json",
        }
    })
    /*
    const accessTokenData = await accessTokenResponse.json()
    if("error" in accessTokenData) {
        return new Response(null, {
            status: 400,
        })
    }
    return Response.json({accessTokenData})
    */
    const {error, access_token} = await accessTokenResponse.json()
    if(error) {
        return new Response(null, {
            status: 400,
        })
    }
    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        cache: "no-cache"
    })
    const {id, avatar_url, login} = await userProfileResponse.json()
    const user = await db.user.findUnique({
        where: {
            github_id: id + ""
        },
        select: {
            id: true
        }
    })
    if(user) {
        // const session = await getSession()
        // session.id = user.id 
        // await session.save()
        // return redirect("/profile")
        await loginProc(user.id)
        return redirect("/profile")
    }

    // 회원정보 없을때
    const newUser = await avoidDupCreateUser("git", id+'', avatar_url, login)
    /**
    const newUser = await db.user.create({
        data: {
            github_id:id + "",
            avatar: avatar_url,
            username: login,
        },
        select: {
            id: true
        }
    })
    */
    if(newUser) {
        // const session = await getSession()
        // session.id = newUser.id 
        // await session.save()
        //return redirect("/profile")
        await loginProc(newUser.id)
        redirect("/profile")
    }
}
/**
 * code changer
 * 1. 로그인 공통 함수 만들기 / 회원가입 함수 만들기 
 * 2. 회원가입시 username 중복시 회피 대책 
 * 3. 이메일 주소도 받아와서 저장하기 > /user/emails
 * 4. fetch에서 request와 response 분리 함수 만들기 
 */