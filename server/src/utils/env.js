import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

export const env = {
  port: parsed.data.PORT,
  clientOrigin: parsed.data.CLIENT_ORIGIN,
}
