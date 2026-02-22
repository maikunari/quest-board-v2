import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Resend from "next-auth/providers/resend"
import { sendOnboardingEmail } from "@/lib/onboarding-email-service"

const TRIAL_DAYS = 7

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "Quest Board <noreply@questboard.sh>",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
    // Protect routes matched by middleware — redirect unauthenticated users to /login
    authorized({ auth: session }) {
      return !!session
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id) return

      // Set trialEndsAt = now + 7 days
      const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
      await prisma.user.update({
        where: { id: user.id },
        data: { trialEndsAt },
      })

      // Send welcome email (fire-and-forget — don't block sign-in on email failure)
      sendOnboardingEmail(user.id, 'welcome').catch((err) => {
        console.error('[auth] Failed to send welcome email:', err)
      })
    },
  },
})
