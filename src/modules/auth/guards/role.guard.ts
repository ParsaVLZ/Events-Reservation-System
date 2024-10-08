import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLE_KEY } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
      ROLE_KEY,
      [
      context.getHandler(),
      context.getClass(),
      ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRole = user?.role ?? Roles.USER;
    if (requiredRoles.includes(userRole as Roles)) {
      return true;
    }
    throw new ForbiddenException();
  }
}
