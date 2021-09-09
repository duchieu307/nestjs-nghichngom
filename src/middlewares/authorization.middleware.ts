import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationMiddleware implements CanActivate {
  //reflector: access route's custom metadata (nestjs's feature)
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride('roles', [
      context.getHandler(), //read metadata
      context.getClass(), //extract metadata
    ]);
    if (!requiredRole){
        return true
    } 
    console.log(requiredRole);
    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    return requiredRole.some((role) => user.role?.includes(role));
    
  }
}
