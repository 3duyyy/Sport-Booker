import { StatusCodes } from 'http-status-codes'
import { AppError } from '../exceptions'

export const timeToMinutes = (time: string) => {
  const parts = time.split(':')

  if (parts.length !== 2) {
    throw new Error('Invalid time format')
  }

  const hour = Number(parts[0])
  const minute = Number(parts[1])

  if (isNaN(hour) || isNaN(minute)) {
    throw new AppError('Invalid time value', StatusCodes.BAD_REQUEST)
  }

  return hour * 60 + minute
}

export const formatHHmm = (date: Date) => {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return hh + ':' + mm
}

export const formatDateDDMMYYYY = (date: Date) => {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return d + '/' + m + '/' + y
}
