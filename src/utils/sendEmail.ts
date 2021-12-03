// import 'dotenv/config'
import * as nodemailer from 'nodemailer'

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"HoLang Service" <${process.env.EMAIL_USERNAME}>`, // sender address
    to,
    subject,
    html,
  })

  return info
}

export const sendUserVerificationEmail = (
  to: string,
  verificaitonCode: string
) =>
  sendEmail(
    to,
    'Please confirm your account',
    `<h1>Email Confirmation</h1>
        <h2>Hello</h2>
        <p>Thank you for signing up. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.DOMAIN_NAME}/auth/verify/${verificaitonCode}> Click here</a>
        </div>`
  )

export const sendTutorVerificationEmail = (
  to: string,
  verificaitonCode: string
) =>
  sendEmail(
    to,
    'Please confirm your account',
    `<h1>Email Confirmation</h1>
        <h2>Hello</h2>
        <p>Thank you for signing up. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.DOMAIN_NAME}/auth/tutors/verify/${verificaitonCode}> Click here</a>
        </div>`
  )
