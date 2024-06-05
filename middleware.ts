import getSession from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    //console.log(request.cookies.getAll())
    //console.log(cookies())
    const session = await getSession()
    console.log(session)

    if(request.nextUrl.pathname === "/profile") {
        // return Response.json({
        //     error:" you are not allowed here!"
        // })
        return Response.redirect(new URL('/', request.url))
    }
}