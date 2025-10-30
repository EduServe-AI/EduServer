import { config } from '../config/app.config'
import { resend } from './resendClient.ts'

type Params = {
    to: string | string[]
    subject: string
    text: string
    html: string
    from?: string
}

const mailer_sender =
    config.NODE_ENV === 'development'
        ? `no-reply <onboarding@resend.dev>` // You can use anything for dev
        : `no-reply <${config.RESEND_FROM_EMAIL}>`

// export const sendEmail = async ({
//     to,
//     from = mailer_sender,
//     subject,
//     text,
//     html,
// }: Params) => {
//     const info = await transporter.sendMail({
//         from,
//         to,
//         subject,
//         text,
//         html,
//     })

//     logger.info('📧 Email sent:', info.messageId)
//     return info
// }

export const sendEmail = async ({
    to,
    from = mailer_sender,
    subject,
    text,
    html,
}: Params) =>
    await resend.emails.send({
        from,
        to: Array.isArray(to) ? to : [to],
        text,
        subject,
        html,
    })
