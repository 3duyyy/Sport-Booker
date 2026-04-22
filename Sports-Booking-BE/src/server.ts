import 'reflect-metadata'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.config'
import { api } from './routes'
import { errorMiddleware } from './middlewares/error.middleware'
import { startBookingExpiryJob } from './jobs/booking-expiry.job'

const app = express()
app.use(compression())
app.use(
  cors({
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  })
)
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api', api)

app.use(errorMiddleware)

app.listen(env.PORT, () => {
  console.log(`Server run on Port: ${env.PORT}`)
  startBookingExpiryJob()
})
