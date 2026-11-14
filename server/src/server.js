import 'dotenv/config'
import app from './app.js'
import { env } from './utils/env.js'

const server = app.listen(env.port, () => {
  console.log(`College Event Management API listening on port ${env.port}`)
})

function shutdown() {
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
