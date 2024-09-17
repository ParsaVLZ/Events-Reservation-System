import { ApiProperty } from "@nestjs/swagger";
import { AuthType } from "../enums/type.enum";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class AuthDto {
    @ApiProperty()
    @IsString()
    @Length(3, 100)
    phone: string;
    @ApiProperty({ enum: AuthType })
    @IsEnum(AuthType)
    type: string;
}

export class CheckOtpDto {
    @ApiProperty()
    @IsString()
    @Length(5, 5)
    code: string;
}
