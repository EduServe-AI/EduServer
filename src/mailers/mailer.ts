import { config } from '../config/app.config'
import logger from '../utils/logger/logger'
import { transporter } from './nodemailerClient'

type Params = {
    to: string | string[]
    subject: string
    text: string
    html: string
    from?: string
}

const mailer_sender =
    config.NODE_ENV === 'development'
        ? `no-reply <dev@example.com>` // You can use anything for dev
        : `no-reply <${config.MAILER.FROM_EMAIL}>`

export const sendEmail = async ({
    to,
    from = mailer_sender,
    subject,
    text,
    html,
}: Params) => {
    const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
    })

    logger.info('📧 Email sent:', info.messageId)
    return info
}
