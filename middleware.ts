import { NextResponse, NextRequest } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from '@/lib/i18n/settings'
import authConfig from './auth.config'
import NextAuth from 'next-auth'
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes, 
  publicPages, 
  publicRoute
} from "@/routes"

const { auth } = NextAuth(authConfig)

acceptLanguage.languages(languages)

function startsWithAny(baseString:string, prefixes:string[]) {
  for (let prefix of prefixes) {
    if (baseString.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

export default auth((req) => {


  // console.log("--------------------------------------");
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const queryString = nextUrl.search;

  // console.log(`Request url: ${nextUrl}`);
  // console.log(`Query string: ${queryString}`);

  const isApiAuthRoute = path.startsWith(apiAuthPrefix);

  // console.log(`Is API Auth Route: ${isApiAuthRoute}`);

  if (isApiAuthRoute) {
    // console.log("API Route.");
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth; // Check user login status
  // console.log(`Is Logged In: ${isLoggedIn}`);
  
  const hasLanguagePrefix = languages.some(lang => path.startsWith(`/${lang}`));
  const languagePrefix = hasLanguagePrefix ? path.split('/')[1] : '';
  const basePath = hasLanguagePrefix ? path.replace(`/${languagePrefix}`, '') : path;

  // console.log(`Has Language Prefix: ${hasLanguagePrefix}`);
  // console.log(`Language Prefix: ${languagePrefix}`);
  // console.log(`Base Path: ${basePath}`);

  const isPublicRoute = publicPages.includes(basePath) || startsWithAny(basePath,publicRoute) ;
  const isAuthRoute = authRoutes.includes(basePath);

  // console.log(`Is Public Route: ${isPublicRoute}`);
  // console.log(`Is Auth Route: ${isAuthRoute}`);

  let lng: string | undefined | null
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng
  // console.log(`Language Preference: ${lng}`);

  if (isAuthRoute && isLoggedIn) {
    // console.log("default login redirect.");
    return NextResponse.redirect(new URL(`/${lng}${DEFAULT_LOGIN_REDIRECT}`, nextUrl));
  } 

  // Correctly handle private routes for not logged-in users
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    let callbackUrl = path;
    if (queryString) {
      callbackUrl += queryString 
    }

    const encodeCallbackUrl = encodeURIComponent(callbackUrl)

    // console.log("logged-out user: private route -> login.");
    return NextResponse.redirect(new URL(`/${lng}/login?callbackUrl=${encodeCallbackUrl}`, nextUrl));
  }

  if (!hasLanguagePrefix) {
    // console.log("Redirecting logged-in user without language prefix to intended path.");
    return NextResponse.redirect(new URL(`/${lng}${basePath}${queryString}`, nextUrl));
  }
  
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '')
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    // console.log("Referer found. Setting language cookie based on referer.");

    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  // console.log("No action taken, proceeding with request.");
  return NextResponse.next();
})
