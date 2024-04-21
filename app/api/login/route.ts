import { serialize } from "cookie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;

    // Input validation
    if (!email || !password) {
        return NextResponse.json(
            {
                message: "Email and password are required",
            },
            {
                status: 400,
            }
        );
    }

    // Make a POST request to the Our API
    const response = await fetch(
        `${process.env.DJANGO_API_URL}/api/user/login/`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        }
    );

    // If the request fails, return an error message to the client-side
    if (!response.ok) {
        let message = "Failed to login";
        if (response.status === 401) {
            message = "Invalid email or password";
        } else if (response.status >= 500) {
            message = "Server error";
        }
        return NextResponse.json(
            {
                message: message,
            },
            {
                status: response.status,
            }
        );
    }

    // If the request is successful, parse the response body to get the data
    const data = await response.json();
    const user = data?.user || null;
    const accessToken = data?.access_token || null;
    const refreshToken = data?.refresh_token || null;

    // Check token expiry
    if (data?.expires_in) {
        const expiresIn = new Date().getTime() + data.expires_in * 1000;
        if (expiresIn <= new Date().getTime()) {
            return NextResponse.json(
                {
                    message: "Access token expired",
                },
                {
                    status: 401,
                }
            );
        }
    }

    // Serialize the refresh token and set it as a cookie with
    // (httpOnly, secure, path, and sameSite options) in the response headers to the client-side
    const cookieName = process.env.COOKIE_REFRESH_TOKEN_NAME || "refresh";
    const serialized = serialize(cookieName, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax", // or "strict" or "none"
    });

    // Return the access token and user data to the client-side
    // with the serialized refresh token as a cookie
    return NextResponse.json(
        {
            accessToken: accessToken,
            user: user,
        },
        {
            status: response.status,
            headers: {
                "Set-Cookie": serialized,
            },
        }
    );
}