import { IsString, IsDate, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
import { EventStatus } from '../enum/event-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
    @IsString()
    @ApiProperty()
    name: string;
    @IsString()
    @ApiProperty()
    description: string;
    @IsString()
    @ApiProperty()
    location: string;
    @IsNumber()
    @ApiProperty()
    price: number;
    @ApiProperty({example: '2024-09-17T09:48'})
    @IsString() 
    startTime: string;
    @IsString() 
    @ApiProperty({example: '2024-09-17T10:48'})
    endTime: string;
    @ApiProperty({enum: EventStatus})
    @IsEnum(EventStatus)
    status: EventStatus;
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;
}
