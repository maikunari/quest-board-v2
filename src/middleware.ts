import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public routes: landing page, sign-in, sign-up, webhooks
const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/contact',
  '/docs',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/contact',
  '/api/asana/webhook(.*)',
  '/api/stripe/webhook(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
