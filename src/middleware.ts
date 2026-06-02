import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  // Supabase の auth-token cookie でセッション有無を確認
  const hasSession = request.cookies.getAll().some(c =>
    c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  if (!hasSession && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (hasSession && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
