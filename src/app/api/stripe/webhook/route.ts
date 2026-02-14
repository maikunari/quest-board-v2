import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.subscription && session.customer) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const plan = subscription.metadata.plan as 'PRO' | 'TEAMS' || 'PRO'

          await prisma.user.update({
            where: { stripeCustomerId: session.customer as string },
            data: {
              plan,
              stripeSubscriptionId: subscription.id,
            },
          })
          console.log(`✓ User upgraded to ${plan} (customer: ${session.customer})`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        if (subscription.status === 'active') {
          const plan = subscription.metadata.plan as 'PRO' | 'TEAMS' || 'PRO'
          await prisma.user.update({
            where: { stripeCustomerId: customerId },
            data: {
              plan,
              stripeSubscriptionId: subscription.id,
            },
          })
          console.log(`✓ Subscription updated to ${plan} (customer: ${customerId})`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            plan: 'FREE',
            stripeSubscriptionId: null,
          },
        })
        console.log(`✓ Subscription cancelled, reverted to FREE (customer: ${customerId})`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.warn(`⚠ Payment failed for customer: ${invoice.customer}`)
        // Grace period — don't downgrade immediately
        // Stripe retries automatically (Smart Retries)
        break
      }

      default:
        // Unhandled event type
        break
    }
  } catch (error) {
    console.error(`Webhook handler error for ${event.type}:`, error)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
