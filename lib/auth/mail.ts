
import { sendEmail } from "@/lib/send-email"
import { verificationTemplate, passwordResetTemplate, twoFATemplate } from "./mailtemp"

const domain = process.env.NEXT_PUBLIC_APP_URL; 

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/new-verification?token=${token}`

  await sendEmail({
    to: email,
    subject: "confirm your email",
    text: "you found a fantasy place",
    html: verificationTemplate(confirmLink, email),
  })
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${domain}/new-password?token=${token}`

  await sendEmail({
    to: email,
    subject: "Reset your password",
    text: "click the button to reset yourpassword",
    html: passwordResetTemplate(resetLink, email),
  })
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  
  await sendEmail({
    to: email,
    subject: "2FA Code",
    text: "click the button to reset yourpassword",
    html: twoFATemplate(token, email),
  })
}