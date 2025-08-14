import nodemailer from 'nodemailer'
import { config } from '../config/app.config'

export const transporter = nodemailer.createTransport({
    host: config.MAILER.SMTP_HOST,
    port: Number(config.MAILER.SMTP_PORT),
    secure: config.MAILER.SMTP_SECURE === 'true', // true for port 465, false for 587
    auth: {
        user: config.MAILER.SMTP_USER,
        pass: config.MAILER.SMTP_PASS,
    },
})
