import { auth } from "@/auth"
import { prisma } from "./prisma"

export async function getUser() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  return user
}

export async function requireUser() {
  const user = await getUser()
  if (!user) throw new Error("Unauthorized")
  return user
}
