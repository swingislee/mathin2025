'use client'

import { useEffect, useState } from 'react'
import i18next, { FlatNamespace, KeyPrefix } from 'i18next'
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
  UseTranslationOptions,
  UseTranslationResponse,
  FallbackNs,
} from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages, cookieName } from './settings'

const runsOnServerSide = typeof window === 'undefined'

// init i18next（和你原来一模一样）
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: { order: ['path', 'htmlTag', 'cookie', 'navigator'] },
    preload: runsOnServerSide ? languages : [],
  })

// helper：从 document.cookie 里读某个 name
function getCookieValue(name: string): string | undefined {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
  return match ? decodeURIComponent(match.split('=')[1]) : undefined
}

// helper：设置 cookie（path=/，一年过期，按需改）
function setCookieValue(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 365 // 1 year
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; max-age=${maxAge}`
}

export function Translate<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(
  lng: string,
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret

  // Server-side 时只做一次 changeLanguage
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
    return ret
  }

  // Client-side：响应 resolvedLanguage 变化
  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
  useEffect(() => {
    if (i18n.resolvedLanguage !== activeLng) {
      setActiveLng(i18n.resolvedLanguage)
    }
  }, [i18n.resolvedLanguage, activeLng])

  // 如果外部给了新 lng，就切换 i18next
  useEffect(() => {
    if (lng && lng !== i18n.resolvedLanguage) {
      i18n.changeLanguage(lng)
    }
  }, [lng, i18n])

  // 同步写回 cookie
  useEffect(() => {
    // 只有当 cookie 不同于当前语言时才写
    const currentCookie = getCookieValue(cookieName)
    const langToWrite = lng || i18n.resolvedLanguage
    // 只有当 langToWrite 真正存在时（string），才调用 setCookieValue
    if (langToWrite && currentCookie !== langToWrite) {
      setCookieValue(cookieName, langToWrite)
    }
    }, [lng, i18n.resolvedLanguage])

  return ret
}
