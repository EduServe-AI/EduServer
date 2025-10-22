import crypto from 'crypto'
import { config } from '../config/app.config'

const key = Buffer.from(config.ENCRYPTION_KEY, 'base64')
const algorithm = 'aes-256-cbc'

export const encryptData = (data: string) => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
}

export const decryptData = (encrypted: string) => {
    const parts = encrypted.split(':')
    const iv = Buffer.from(parts.shift() as string, 'hex')
    const encryptedText = parts.join(':')
    const decripher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decripher.update(encryptedText, 'hex', 'utf8')
    decrypted += decripher.final('utf8')
    return decrypted
}
