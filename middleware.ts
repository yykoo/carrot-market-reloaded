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
    "/github/complete": true,
}

export async function middleware(request: NextRequest) {
    const exists = publicOnlyUrls[request.nextUrl.pathname]
    const session = await getSession()
    if(!session.id) {
        if(!exists) {
            return NextResponse.redirect(new URL("/", request.url))
        }
    } else {
        if(exists) {
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
