import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';

// code giống doc
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly redisCacheService: RedisService, private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'can1cogaivuto',
    });
  }

  async validate(payload) {
    try {
      const refreshToken = payload.refreshToken;
      const checkRedisToken = await this.redisCacheService.get(refreshToken);

    } catch (error) {
      throw new UnauthorizedException("Token ko hop le");
    }

    console.log(payload)

    
    // if (checkRedisToken == null) {
    //   throw new UnauthorizedException('Token không hợp lệ');
    // }

    return {
      username: payload.username,
      userId: payload.id,
      userRole: payload.role,
    };
  }
}
