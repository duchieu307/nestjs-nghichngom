import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthorizationMiddleware implements CanActivate {
  //reflector: access route's custom metadata (nestjs's feature)
  constructor(private reflector: Reflector, private readonly redisCacheService: RedisService) {}

   canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride('roles', [
      context.getHandler(), //read metadata
      context.getClass(), //extract metadata
    ]);
    if (!requiredRole) {
      return true;
    }
    console.log(requiredRole);

    const { user } = context.switchToHttp().getRequest();

    return requiredRole.some((role) => user.userRole?.includes(role));
  }
}
