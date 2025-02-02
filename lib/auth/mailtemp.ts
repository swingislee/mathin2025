export function verificationTemplate(confirmLink: string, sendEmail: string) {
  const sendInfo = {
    confirmLink: confirmLink,
    url: process.env.NEXTAUTH_URL,
    domain: process.env.DOMAIN,
    sendEmail: sendEmail,
  }
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <title>Welcome Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Welcome to Our Community!</h2>
      <p>Dear Mather,</p>
      <p>Thank you for signing up. Please confirm your email address to complete your registration.</p>
      <p><a href="${confirmLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; display: inline-block; border-radius: 5px;">Confirm Email</a></p>
      <p>If the above button doesn't work, please copy and paste the following link into your browser:</p>
      <p style="word-wrap: break-word; margin: 10px 0;"><code>${confirmLink}</code></p>
      <p>This link will expire in 24 hours for security reasons. If you did not initiate this request, please ignore this email.</p>
      <p>Best regards,<br> 李成浩 </p>
      <footer style="font-size: 12px; color: #777;">
          <p>This message was sent to ${sendInfo.sendEmail} from ${sendInfo.domain} .</p>
          <p>For more information, visit our website at ${sendInfo.domain}.</p>
      </footer>
  </body>
  </html>
  `
}

export function passwordResetTemplate(resetLink: string, sendEmail: string) {
  const sendInfo = {
    confirmLink: resetLink,
    url: process.env.NEXTAUTH_URL,
    domain: process.env.DOMAIN,
    sendEmail: sendEmail,
  }
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <title>Password Reset Request</title>
  </head>
  <body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Dear Mather,</p>
      <p>You recently requested to reset your password for your account. Click the button below to reset it:</p>
      <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; display: inline-block; border-radius: 5px;">Reset Your Password</a></p>
      <p>If the above button doesn't work, please copy and paste the following link into your browser:</p>
      <p style="word-wrap: break-word; margin: 10px 0;"><code>${resetLink}</code></p>
      <p>This link will expire in 24 hours for security reasons. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Best regards,<br> 李成浩 </p>
      <footer style="font-size: 12px; color: #777;">
          <p>This message was sent to ${sendInfo.sendEmail} from ${sendInfo.domain} .</p>
          <p>For more information, visit our website at ${sendInfo.domain}</p>
      </footer>
  </body>
  </html>  
  `
}


export function twoFATemplate(token: string, sendEmail: string) {
  const sendInfo = {
    token: token,
    url: process.env.NEXTAUTH_URL,
    domain: process.env.DOMAIN,
    sendEmail: sendEmail,
  }
  return `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Two-Factor Authentication (2FA) Code</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Two-Factor Authentication (2FA) Code</h2>
        <p>Dear Mather,</p>
        <p>Your Two-Factor Authentication (2FA) code is:</p>
        <p style="font-size: 24px; font-weight: bold; margin: 20px 0;">${sendInfo.token}</p>
        <p>Please enter this code in the provided field on the website to proceed. The code is valid for 1 hour.</p>
        <p>If you did not request this code or if you have any issues, please contact our support team immediately.</p>
        <p>Best regards,<br>李成浩</p>
        <footer style="font-size: 12px; color: #777;">
            <p>This message was sent to ${sendInfo.sendEmail} from ${sendInfo.domain}.</p>
            <p>For more information or to contact support, please visit our website.</p>
        </footer>
    </body>
    </html>
  `;
}