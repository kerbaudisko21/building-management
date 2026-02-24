import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/signup', '/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets, API, icons — no auth check needed
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icons') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // ═══════════════════════════════════════════════════════
    // KEY FIX: getSession() reads JWT from cookie = LOCAL, NO NETWORK
    // getUser() calls Supabase API = NETWORK = SLOW = CAN FAIL
    // ═══════════════════════════════════════════════════════
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
    const isRoot = pathname === '/'

    if (!session && !isPublicRoute && !isRoot) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (session && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (session && isRoot) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    // If anything fails, don't block — let client-side handle auth
    console.warn('Middleware auth skipped:', error instanceof Error ? error.message : error)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
