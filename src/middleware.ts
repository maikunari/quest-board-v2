export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/quests/:path*', '/admin/:path*', '/stats/:path*', '/history/:path*', '/achievements/:path*', '/settings/:path*']
}
