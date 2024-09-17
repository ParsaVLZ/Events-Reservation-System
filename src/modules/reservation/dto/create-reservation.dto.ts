import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  eventId: number;
  @IsOptional()
  @IsNumber()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  quantity: number;
}
