import { NextResponse } from 'next/server';

export function middleware(request) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  // If credentials have not been configured yet, allow access so the first deployment can be tested.
  if (!user || !password) return NextResponse.next();

  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const separator = decoded.indexOf(':');
      const suppliedUser = decoded.slice(0, separator);
      const suppliedPassword = decoded.slice(separator + 1);
      if (suppliedUser === user && suppliedPassword === password) return NextResponse.next();
    } catch {}
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Trevor Repository Admin"' }
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
