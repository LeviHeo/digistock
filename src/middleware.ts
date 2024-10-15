import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from '@/app/i18n.config';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|_next/img|img|.next|assets|favicon.ico|sw.js|robots.txt).*)'],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  if (
    pathname.includes('/manifest.json') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('/assets') ||
    pathname.includes('/_next')
  ) {
    return NextResponse.next();
  }

  console.log('\x1b[36m%s\x1b[0m', '➤ Pathname:', pathname);

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-forwarded-pathname', `${pathname}`);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
