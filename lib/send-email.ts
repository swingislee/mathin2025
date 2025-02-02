import nodemailer from 'nodemailer'

interface IEmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, //我的邮箱
    pass: process.env.EMAIL_PASS, //授权码
  },
})

export const sendEmail = async ({ to, subject, text, html }: IEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    })
    return info
  } catch (error) {
    // 失败时候的处理
    throw new Error('BAD_REQUEST')
  }
}