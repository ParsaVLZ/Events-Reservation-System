import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TokenService } from './token.service';
import { OtpEntity } from '../user/entities/otp.entity';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthResponse } from './types/response';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { AuthMessage, BadRequestMessage, PublicMessage } from 'src/common/enums/message.enum';
import { randomInt } from 'crypto';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { Request, Response } from 'express';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        private tokenService: TokenService,
        @Inject(REQUEST) private request: Request
    ) {}

    async userExistence(authDto: any, res: Response) {
      const { type, phone } = authDto;
      let result: AuthResponse;
      switch (type) {
          case AuthType.LOGIN:
              result = await this.login(AuthMethod.Phone, phone);
              return this.sendResponse(res, result);
          case AuthType.REGISTER:
              result = await this.register(AuthMethod.Phone, phone);
              return this.sendResponse(res, result);
          default:
              throw new UnauthorizedException();
      }
    }

    async login(method: AuthMethod, phone: string) {
      const user = await this.checkExistUser(method, phone);
      if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);
      const otp = await this.saveOtp(user.id, method);
      const token = this.tokenService.createOtpToken({ userId: user.id });
      return {
          token,
          code: otp.code
      };   
  }
    async register(method: AuthMethod, phone: string) {
      const userExists = await this.checkExistUser(method, phone);
      if (userExists) throw new ConflictException(AuthMessage.AlreadyExistAccount);
      const user = this.userRepository.create({ [method]: phone });
      await this.userRepository.save(user);
      const otp = await this.saveOtp(user.id, method);
      const token = this.tokenService.createOtpToken({ userId: user.id });
      return {
          token,
          code: otp.code
      };
    }

    async saveOtp(userId: number, method: AuthMethod) {
      let otp = await this.otpRepository.findOneBy({ userId });
      const now = new Date();
      if(otp && otp.expiresIn > now) throw new BadRequestException(BadRequestMessage.OTPNotExpired)
      const code = randomInt(10000, 99999).toString(); 
      const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
      if (otp) {
          otp.code = code;
          otp.expiresIn = expiresIn;
          otp.method = method;
      } else {
          otp = this.otpRepository.create({ code, expiresIn, userId, method });
      }
      return this.otpRepository.save(otp);
    }

    async sendResponse(res: Response, result: AuthResponse){
      const { token, code } = result;
      res.cookie(CookieKeys.OTP, token, CookiesOptionsToken());
      res.json({
          message: PublicMessage.SentOtp,
          code 
      });
    }

    async checkOtp(code: string) {
      const token = this.request.cookies?.[CookieKeys.OTP];
      if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
      const { userId } = this.tokenService.verifyOtpToken(token);
      const otp = await this.otpRepository.findOneBy({ userId });
      if (!otp || otp.code !== code) throw new UnauthorizedException(AuthMessage.LoginAgain);
      const now = new Date();
      if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode);
      const accessToken = this.tokenService.createAccessToken({ userId });
      return { 
        message: PublicMessage.LoggedIn,
        accessToken 
      };
   }

   async checkExistUser(method: AuthMethod, phone: string) {
    if (method === AuthMethod.Phone) {
        return await this.userRepository.findOneBy({ phone });
    }
    throw new BadRequestException(BadRequestMessage.InValidLoginData);
    }
    
    async validateAccessToken(token: string) {
      const { userId } = this.tokenService.verifyAccessToken(token);
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
      return user;
  }

}