// middleware.ts (at project root)
import { NextResponse, NextRequest } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from '@/lib/i18n/settings'
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicPages,
  publicRoute,
} from '@/routes'
import { updateSession } from '@/utils/supabase/middleware'

acceptLanguage.languages(languages)

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

export default async function middleware(req: NextRequest) {
  // 1. Refresh Supabase cookies & grab the user
  const { response: supaRes, user } = await updateSession(req)

  // 2. If it's an API-auth route, just let it through
  const path = req.nextUrl.pathname
  if (path.startsWith(apiAuthPrefix)) {
    return supaRes
  }

  // 3. Detect i18n prefix
  const hasLang = languages.some(l => path.startsWith(`/${l}`))
  const lang = hasLang
    ? path.split('/')[1]
    : acceptLanguage.get(
        req.cookies.get(cookieName)?.value
        ?? req.headers.get('Accept-Language')     // fallback to header
      ) || fallbackLng
  const basePath = hasLang ? path.replace(`/${lang}`, '') : path
  const query = req.nextUrl.search

  // 4. Auth status
  const isLoggedIn  = !!user
  const isPublic    = publicPages.includes(basePath)
                   || publicRoute.some(p => basePath.startsWith(p))
  const isAuthRoute = authRoutes.includes(basePath)

  // 5. If user hits an *auth* route while logged in → redirect home
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${lang}${DEFAULT_LOGIN_REDIRECT}`, req.url)
    )
  }

  // 6. If user hits a protected (non-public, non-auth) route while logged out → login
  if (!isLoggedIn && !isPublic && !isAuthRoute) {
    const callback = encodeURIComponent(basePath + query)
    return NextResponse.redirect(
      new URL(`/${lang}/login?callbackUrl=${callback}`, req.url)
    )
  }

  // 7. Ensure every URL has a language prefix
  if (!hasLang) {
    return NextResponse.redirect(
      new URL(`/${lang}${basePath}${query}`, req.url)
    )
  }

  // 8. Finally, carry through any “Referer-based” cookie updates
  if (req.headers.has('referer')) {
    const ref = new URL(req.headers.get('referer')!)
    const refLang = languages.find(l => ref.pathname.startsWith(`/${l}`))
    if (refLang) {
      supaRes.cookies.set(cookieName, refLang)
    }
  }

  // 9. Return the Supabase-synced response
  return supaRes
}


// // middleware.ts
// import { NextRequest, NextResponse } from 'next/server'
// import acceptLanguage from 'accept-language'
// import { fallbackLng, languages, cookieName } from '@/lib/i18n/settings'
// import { 
//   DEFAULT_LOGIN_REDIRECT, 
//   apiAuthPrefix, 
//   authRoutes, 
//   publicPages, 
//   publicRoute
// } from "@/routes"
// import { updateSession } from '@/utils/supabase/middleware'
// import { createServerClient } from '@supabase/ssr'

// acceptLanguage.languages(languages)

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// }

// export default async function middleware(request: NextRequest) {
//   // —— 1. 刷新 Supabase Session Token —— 
//   // 负责自动刷新过期 token 并同步到 request/response 的 cookies
//   const supaRes = await updateSession(request)
//   // 如果官方 updateSession 已经在内部做了重定向（到 /login），直接返回
//   if (supaRes.headers.get('location')?.includes('/login')) {
//     return supaRes
//   }

//   // —— 2. 判断登录状态 —— 
//   // 注意此时 request.cookies 已被 updateSession 更新过
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         // 只需要读 cookies 即可判断登录
//         getAll: () => request.cookies.getAll(),
//         // 不在此处写 setAll，所有刷新逻辑都留给 updateSession
//         setAll: () => {}
//       },
//     }
//   )
//   const { data: { user } } = await supabase.auth.getUser()
//   const isLoggedIn = Boolean(user)

//   // —— 3. 原有多语言 & 公开/私有路由逻辑 —— 
//   const { nextUrl } = request
//   const path = nextUrl.pathname
//   const query = nextUrl.search || ''
//   const isApiAuthRoute = path.startsWith(apiAuthPrefix)

//   if (isApiAuthRoute) {
//     // API 相关的 Auth 前缀，不做跳转
//     return supaRes
//   }

//   // 语言前缀处理
//   const hasLang = languages.some(l => path.startsWith(`/${l}`))
//   const lng = (() => {
//     if (request.cookies.has(cookieName)) {
//       return acceptLanguage.get(request.cookies.get(cookieName)!.value)
//     }
//     return (
//       acceptLanguage.get(request.headers.get('Accept-Language') ?? '') ||
//       fallbackLng
//     )
//   })()!

//   // 去掉语言前缀后的基础路径
//   const basePath = hasLang ? path.replace(`/${lng}`, '') : path
//   const isPublic = publicPages.includes(basePath) || publicRoute.some(p => basePath.startsWith(p))
//   const isAuthPage = authRoutes.includes(basePath)

//   // 已登录用户访问登录页 → 跳转到首页
//   if (isAuthPage && isLoggedIn) {
//     return NextResponse.redirect(new URL(`/${lng}${DEFAULT_LOGIN_REDIRECT}`, request.url))
//   }

//   // 未登录用户访问私有页 → 强制跳转到登录页（带回调）
//   if (!isLoggedIn && !isPublic && !isAuthPage) {
//     const cb = encodeURIComponent(path + query)
//     return NextResponse.redirect(new URL(`/${lng}/login?callbackUrl=${cb}`, request.url))
//   }

//   // 未带语言前缀 → 自动加上
//   if (!hasLang) {
//     return NextResponse.redirect(new URL(`/${lng}${path}${query}`, request.url))
//   }

//   // Referer 中如果带语言 → 同步写入 Cookie
//   if (request.headers.has('referer')) {
//     const ref = new URL(request.headers.get('referer')!)
//     const refLng = languages.find(l => ref.pathname.startsWith(`/${l}`))
//     const resp = NextResponse.next({ request })
//     if (refLng) resp.cookies.set(cookieName, refLng)
//     return resp
//   }

//   // 其余情况一律放行，并带上刷新后的 cookies
//   return supaRes
// }
