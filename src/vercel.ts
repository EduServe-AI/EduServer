import { VercelRequest, VercelResponse } from '@vercel/node'
import serverless from 'serverless-http'
import app from './app'

const handler = serverless(app)

export default async (req: VercelRequest, res: VercelResponse) => {
    return handler(req, res)
}
