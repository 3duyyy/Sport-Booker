import { StatusCodes } from 'http-status-codes'
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyOtpDto } from '../../dtos/auth.dto'
import { AppError } from '../../shared/exceptions'
import { AuthRepository } from './auth.repository'
import bcrypt from 'bcryptjs'
import { BcryptUtil } from '../../shared/utils/bcryptUtil'
import { JwtUtil } from '../../shared/utils/jwt'
import { UsersRepository } from '../users/users.repository'
import nodemailer from 'nodemailer'
import { env } from '../../config/env.config'

export class AuthService {
  static async register(registerDto: RegisterDto) {
    const existingUser = await UsersRepository.findByEmail(registerDto.email)
    if (existingUser) {
      throw new AppError('Email đã tồn tại!', StatusCodes.BAD_REQUEST)
    }

    const passwordHash = await BcryptUtil.hash(registerDto.password)

    const user = await UsersRepository.createUser({
      email: registerDto.email,
      passwordHash,
      fullName: registerDto.fullName,
      roleId: 3
    })

    const payload = { id: user.id, email: user.email, roleId: user.roleId }
    const accessToken = JwtUtil.generateAccessToken(payload)
    const refreshToken = JwtUtil.generateRefreshToken(payload)
    const tokenHash = JwtUtil.hashToken(refreshToken)
    await AuthRepository.saveRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    })

    const { passwordHash: _, ...userResult } = user

    return {
      user: userResult,
      accessToken,
      refreshToken
    }
  }

  static async login(loginDto: LoginDto) {
    const user = await UsersRepository.findByEmail(loginDto.email)
    if (!user) {
      throw new AppError('Email hoặc mật khẩu không chính xác', StatusCodes.UNAUTHORIZED)
    }

    const isPasswordValid = await BcryptUtil.compare(loginDto.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new AppError('Email hoặc mật khẩu không chính xác', StatusCodes.UNAUTHORIZED)
    }

    if (user.status === 'pending_approve') {
      throw new AppError('Tài khoản chưa được phê duyệt!', StatusCodes.FORBIDDEN)
    }

    if (user.status === 'banned') {
      throw new AppError('Tài khoản đã bị khóa!', StatusCodes.FORBIDDEN)
    }

    const payload = { id: user.id, email: user.email, roleId: user.roleId }
    const accessToken = JwtUtil.generateAccessToken(payload)
    const refreshToken = JwtUtil.generateRefreshToken(payload)
    const tokenHash = JwtUtil.hashToken(refreshToken)
    await AuthRepository.saveRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    })

    const { passwordHash, ...userResult } = user
    return {
      user: userResult,
      accessToken,
      refreshToken
    }
  }

  static async refreshToken(oldRT: string) {
    let payload
    try {
      payload = JwtUtil.verifyRefreshToken(oldRT)
    } catch (error) {
      throw new AppError('Refresh token không hợp lệ', StatusCodes.UNAUTHORIZED)
    }

    const tokenHash = JwtUtil.hashToken(oldRT)
    const storedToken = await AuthRepository.getRefreshToken(tokenHash)
    if (!storedToken || storedToken.isRevoked) {
      throw new AppError('Refresh token đã bị thu hồi', StatusCodes.UNAUTHORIZED)
    }

    if (storedToken.expiresAt < new Date()) {
      await AuthRepository.revokeRefreshToken(tokenHash)
      throw new AppError('Hết phiên đăng nhập, vui lòng đăng nhập lại!', StatusCodes.UNAUTHORIZED)
    }

    const user = await UsersRepository.findById(payload.id)
    if (!user) {
      throw new AppError('User không tồn tại', StatusCodes.NOT_FOUND)
    }

    const newPayload = { id: user.id, email: user.email, roleId: user.roleId }
    const newAT = JwtUtil.generateAccessToken(newPayload)
    const newRT = JwtUtil.generateRefreshToken(newPayload)

    await AuthRepository.revokeRefreshToken(tokenHash)
    const newTokenHash = JwtUtil.hashToken(newRT)
    await AuthRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    })

    return {
      user,
      accessToken: newAT,
      refreshToken: newRT
    }
  }

  static async logout(refreshToken: string) {
    const tokenHash = JwtUtil.hashToken(refreshToken)
    await AuthRepository.revokeRefreshToken(tokenHash)
    return { message: 'Logout thành công' }
  }

  static async logoutAllDevices(userId: number) {
    await AuthRepository.revokeAllRefreshTokens(userId)
    return { message: 'Logout tất cả thiết bị thành công' }
  }

  static async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await UsersRepository.findByEmail(email)
    if (!user) {
      throw new AppError('Email không tồn tại trong hệ thống', StatusCodes.NOT_FOUND)
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await UsersRepository.saveOtp(user.id, otpCode, otpExpiresAt)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD
      }
    })

    await transporter.sendMail({
      from: `"Sports Booker" <${env.EMAIL_USER}>`,
      to: email,
      subject: 'Mã xác nhận khôi phục mật khẩu',
      html: `Mã OTP của bạn là: <b style="font-size: 16px;">${otpCode}</b>. Mã này sẽ hết hạn sau 5 phút.`
    })

    return { message: 'Mã OTP đã gửi đến email của bạn!' }
  }

  static async verifyOtp({ email, otp }: VerifyOtpDto) {
    const user = await UsersRepository.findByEmail(email)
    if (!user || user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new AppError('Mã OTP không hợp lệ hoặc đã hết hạn', StatusCodes.BAD_REQUEST)
    }

    return { message: 'Xác nhận OTP thành công!' }
  }

  static async resetPassword({ email, otp, newPassword }: ResetPasswordDto) {
    const user = await UsersRepository.findByEmail(email)

    if (!user || user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new AppError('Mã OTP không hợp lệ hoặc đã hết hạn', StatusCodes.BAD_REQUEST)
    }

    const newPasswordHash = await BcryptUtil.hash(newPassword)

    await UsersRepository.clearOtpAndResetPassword(user.id, newPasswordHash)

    return { message: 'Đổi mật khẩu thành công!' }
  }
}
