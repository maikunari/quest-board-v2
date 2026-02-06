import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple password protection for Quest Board
// Set QUEST_BOARD_PASSWORD env var in Vercel

export function middleware(request: NextRequest) {
  // Skip auth for API routes (webhooks need access)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Skip if no password configured
  const password = process.env.QUEST_BOARD_PASSWORD
  if (!password) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('quest-auth')?.value
  if (authCookie === password) {
    return NextResponse.next()
  }

  // Check for password in query param (for initial login)
  const queryPassword = request.nextUrl.searchParams.get('password')
  if (queryPassword === password) {
    // Set cookie and redirect to clean URL
    const response = NextResponse.redirect(new URL(request.nextUrl.pathname, request.url))
    response.cookies.set('quest-auth', password, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return response
  }

  // Show login page
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Quest Board - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: system-ui, sans-serif;
            background: #0f0a1e;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
          }
          .login-box {
            background: #1a1333;
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(255,255,255,0.1);
            text-align: center;
          }
          h1 { margin: 0 0 1rem; font-size: 1.5rem; }
          input {
            background: #0f0a1e;
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            width: 200px;
            margin-bottom: 1rem;
          }
          button {
            background: #8b5cf6;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
          }
          button:hover { background: #7c3aed; }
        </style>
      </head>
      <body>
        <div class="login-box">
          <h1>🎮 Quest Board</h1>
          <form method="GET">
            <input type="password" name="password" placeholder="Password" autofocus required>
            <br>
            <button type="submit">Enter</button>
          </form>
        </div>
      </body>
    </html>`,
    {
      status: 401,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  )
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
