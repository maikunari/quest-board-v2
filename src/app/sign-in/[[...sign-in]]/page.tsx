import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignIn
        forceRedirectUrl="/quests"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-slate-900 border border-white/10',
          },
        }}
      />
    </div>
  )
}
