import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    const user = await requireUser()

    if (!user.stripeCustomerId) {
      return NextResponse.json({ error: 'No billing account' }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
