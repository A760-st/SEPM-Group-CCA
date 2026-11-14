import cors from 'cors'
import express from 'express'
import { env } from './utils/env.js'

const app = express()

app.use(cors({ origin: env.clientOrigin }))
app.use(express.json())

app.get('/api/v1/health', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})

export default app
