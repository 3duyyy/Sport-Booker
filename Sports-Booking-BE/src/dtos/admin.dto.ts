import { Type } from 'class-transformer'
import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ROLE_IDS, USER_STATUSES } from '../shared/utils/utils'

export class CreateAdminUserDto {
  @Type(() => Number)
  @IsIn(ROLE_IDS)
  roleId!: 1 | 2 | 3

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName!: string

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  @MinLength(6, { message: 'Password phải tối thiểu 6 ký tự' })
  @MaxLength(100)
  password!: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string

  @IsOptional()
  @IsString()
  @IsIn(USER_STATUSES)
  status: 'active' | 'banned' | 'pending_approve' = 'active'

  @IsOptional()
  @IsBoolean()
  isVerified: boolean = false
}

export class UpdateAdminUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsIn(ROLE_IDS)
  roleId?: 1 | 2 | 3

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string | null

  @IsOptional()
  @IsString()
  @IsIn(USER_STATUSES)
  status?: 'active' | 'banned' | 'pending_approve'

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean
}

export class UpdateAdminUserStatusDto {
  @IsString()
  @IsIn(['active', 'banned'])
  status!: 'active' | 'banned'
}

export class UpdateAdminFacilityStatusDto {
  @IsString()
  @IsIn(['active', 'inactive'])
  status!: 'active' | 'inactive'
}
