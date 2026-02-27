import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/about', '/contact', '/api/health', '/api/intelligence-data', '/api/financial-assistant']);

export default clerkMiddleware(async (auth, request) => {
    const isApiRequest = request.nextUrl.pathname.startsWith('/api');
    console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}${isApiRequest ? ' (API)' : ''}`);

    if (!isPublicRoute(request) && !isApiRequest) {
        await auth.protect();
    }
});




export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
