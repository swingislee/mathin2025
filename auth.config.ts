import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { OAuthConfig } from "@auth/core/providers"

import { LoginSchema } from "@/schemas/auth"
import { getUserByEmail } from "@/data/auth/user";

interface WeChatProfile {
	openid: string
	nickname: string
	sex: number
	province: string
	city: string
	country: string
	headimgurl: string
	privilege: string[]
	unionid: string
	[claim: string]: unknown
}

interface TencentQQProfile {
  id: string
  name: string
  email: string
  image: string
}


export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success){
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (passwordsMatch) return user;

        }
        return null;
      }
    }),

    //wechat providers
    {
      id: 'wechat',
      name: 'WeChat',
      type: 'oauth',
      style: { logo: 'assets/wechat.svg', bg: '#fff', text: '#000' },
      checks: ["pkce", "state"],
      clientId: process.env.AUTH_WECHAT_APP_ID,
      clientSecret: process.env.AUTH_WECHAT_APP_SECRET!,
      authorization: {
        url: "https://open.weixin.qq.com/connect/oauth2/authorize",
        params: { 
          appid: process.env.AUTH_WECHAT_APP_ID,
          response_type: 'code',
          scope:"snsapi_base",
          state: Math.random(),
        },
      },
      token: {
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
        params: {
          appid: process.env.AUTH_WECHAT_APP_ID!,
          secret: process.env.AUTH_WECHAT_APP_SECRET!,
          code: 'CODE',
          grant_type: 'authorization_code',
        }},
      userinfo: {
        url: 'https://api.weixin.qq.com/sns/userinfo',
        request: async ({ tokens, provider }:any) => {
          const url = new URL(provider.userinfo?.url!)
          url.searchParams.set('access_token', tokens.access_token!)
          url.searchParams.set('openid', String(tokens.openid))
          url.searchParams.set('lang', 'zh_CN')
          const response = await fetch(url)
          return response.json()
        },
      },
      profile(profile:any, tokens:any) {
        return {
          id: profile.unionid,
          name: profile.nickname,
          email: null,
          image: profile.headimgurl,
        };
      },
    }satisfies OAuthConfig<WeChatProfile>,

    {
      id: "qq",
      name: "QQ",
      type: "oauth", 
      clientId: process.env.TENCENT_ID,
      clientSecret: process.env.TENCENT_SECRET,
      authorization: "https://graph.qq.com/oauth2.0/authorize",
      token:{
        url: "https://graph.qq.com/oauth2.0/token",
        async request(context:any) {
          const response = await fetch("https://graph.qq.com/oauth2.0/token", {
            method: "POST",
            body: JSON.stringify({
              grant_type: "authorization_code",
              client_id: context.provider.clientId,
              client_secret: context.provider.clientSecret,
              code: context.params.code,
              redirect_uri: context.provider.callbackUrl,
              fmt: "json",
            }),
          })
          const tokens = await response.json()
          return { tokens }
        },
      },
      userinfo: {
        url: "https://graph.qq.com/oauth2.0/me",
        async request(context:any) {
          const response = await fetch(
            "https://graph.qq.com/oauth2.0/me?" +
              new URLSearchParams({
                access_token: context.tokens.access_token || "",
                fmt: "json",
              })
          )
          const openIDInfo = await response.json()
          const userInfoResponse = await fetch(
            "https://graph.qq.com/user/get_user_info?" +
              new URLSearchParams({
                access_token: context.tokens.access_token || "",
                oauth_consumer_key: openIDInfo.client_id,
                openid: openIDInfo.openid,
              })
          )
          return { ...(await userInfoResponse.json()), openid: openIDInfo.openid }
        },
      },
      profile(profile: any) {
        return {
          id: profile.openid,
          name: profile.nickname,
          email: null,
          image: profile.figureurl_qq_2 || profile.figureurl_qq_1,
        }
      },      
    }satisfies OAuthConfig<TencentQQProfile>
  ],
} satisfies NextAuthConfig