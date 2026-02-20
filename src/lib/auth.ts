import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

/**
 * Get the current authenticated user's DB record.
 * Creates the user record if it doesn't exist (first login).
 * Returns null if not authenticated.
 */
export async function getUser() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  // Try to find existing user
  let user = await prisma.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    // First login — create user record
    const clerkUser = await currentUser()
    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? null,
        displayName: clerkUser?.firstName
          ? `${clerkUser.firstName}${clerkUser.lastName ? ' ' + clerkUser.lastName : ''}`
          : null,
        avatarUrl: clerkUser?.imageUrl ?? null,
      },
    })
  }

  return user
}

/**
 * Get the current user or throw 401.
 * Use in API routes that require authentication.
 */
export async function requireUser() {
  const user = await getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
