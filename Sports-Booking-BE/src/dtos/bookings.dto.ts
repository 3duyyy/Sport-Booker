import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'

export class BookingSlotDto {
  @IsNotEmpty({ message: 'startTime không được để trống' })
  @IsString()
  startTime!: string
  @IsNotEmpty({ message: 'endTime không được để trống' })
  @IsString()
  endTime!: string
}

export class CreateBookingDto {
  @IsNotEmpty({ message: 'fieldId không được để trống' })
  @IsInt({ message: 'fieldId phải là số nguyên' })
  @Min(1)
  fieldId!: number

  @IsNotEmpty({ message: 'date không được để trống' })
  @IsDateString({}, { message: 'date phải đúng định dạng YYYY-MM-DD' })
  date!: string

  @IsArray()
  @ArrayMinSize(1, { message: 'Phải chọn ít nhất 1 khung giờ' })
  @ValidateNested({ each: true })
  @Type(() => BookingSlotDto)
  slots!: BookingSlotDto[]
  @IsNotEmpty({ message: 'paymentOption không được để trống' })
  @IsIn(['deposit', 'full'], { message: 'paymentOption phải là deposit hoặc full' })
  paymentOption!: 'deposit' | 'full'
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Ghi chú tối đa 500 ký tự' })
  note?: string
}
