import getSession from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { boolean } from "zod";

interface Routes {
    [key:string]: boolean
}
const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true
}

export async function middleware(request: NextRequest) {
    console.log(`\nmd #0 > ${request.url}`)

    const exists = publicOnlyUrls[request.nextUrl.pathname]
    const session = await getSession()
    if(!session.id) {
        if(!exists) {
            console.log(`md #1-1 > ${request.url}`)
            //return NextResponse.redirect(new URL("/", request.url))
        } else {
            console.log(`md #1-2 > ${request.url}`)
        }
    } else {
        console.log('md #2')
        if(exists) {
            console.log('md #2-1')
            /* if(request.nextUrl.pathname.indexOf("/product/add") !== -1) {
                return NextResponse.redirect(new URL("/products/add", request.url))
            } else {
                return NextResponse.redirect(new URL("/home", request.url))
            } */
            return NextResponse.redirect(new URL("/home", request.url))
        }
    }
}

export const config = {
    //matcher: ["/", "/profile", "/user/:path*"]
    matcher: ["/((?!api|_next|static|_next/image|favicon.ico).*)"]
}
