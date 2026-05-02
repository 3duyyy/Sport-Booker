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
import path from 'path'

const app = express()
app.set('query parser', 'extended')
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
// Fix: helmet đang chỉ cho phép nhúng ảnh vào thẻ img khi ở cùng 1 port
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api', api)

app.use(errorMiddleware)

app.listen(env.PORT, () => {
  console.log(`Server run on Port: ${env.PORT}`)
  startBookingExpiryJob()
})
