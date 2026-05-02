import { Router } from 'express'
import { validationMiddleware } from '../../middlewares/validation.middleware'
import { ForgotPasswordDto, LoginDto, RefreshTokenDto, RegisterDto, ResetPasswordDto, VerifyOtpDto } from '../../dtos/auth.dto'
import { AuthController } from './auth.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.post('/register', validationMiddleware(RegisterDto), AuthController.register)
router.post('/login', validationMiddleware(LoginDto), AuthController.login)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/logout', authMiddleware, AuthController.logout)
router.post('/logout-all', authMiddleware, AuthController.logoutAll)
router.post('/forgot-password', validationMiddleware(ForgotPasswordDto), AuthController.forgotPassword)
router.post('/verify-otp', validationMiddleware(VerifyOtpDto), AuthController.verifyOtp)
router.post('/reset-password', validationMiddleware(ResetPasswordDto), AuthController.resetPassword)

export const authRoutes = router
