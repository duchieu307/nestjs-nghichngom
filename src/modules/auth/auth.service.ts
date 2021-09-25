import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/auth/user.repository';
import { UserForCreation } from 'src/modules/auth/dto/user-for-creation.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly redisCacheService: RedisService,
  ) {}

  async signUp(userForCreation: UserForCreation) {
    return this.userRepository.signUp(userForCreation);
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new UnauthorizedException('Username không tồn tại');
    } else {
      const match = await bcrypt.compare(password, user.password);
      console.log(match);
      if (match) {
        const role = user.role;
        const id = user.id;
        const refreshToken = uuidv4();
        const payload = { username, role, id, refreshToken };
        const accessToken = await this.jwtService.sign(payload);
        this.redisCacheService.set(refreshToken, accessToken);
        return { accessToken, refreshToken };
      } else {
        throw new UnauthorizedException('Sai password');
      }
    }
  }

  async refreshToken(oldToken: string, refreshToken: string) {
    const redisToken = await this.redisCacheService.get(refreshToken);
    if (oldToken != redisToken) {
      throw new UnauthorizedException('Token khong hop le');
    } else {
      const newRefreshToken = uuidv4();
      const oldData = await this.jwtService.verify(oldToken,{
        ignoreExpiration: true
      });
      // nen them kieu cua payload
      const payload = {
        username: oldData.username,
        role: oldData.role,
        id: oldData.id,
        refreshToken: newRefreshToken,
      };
      const newToken = await this.jwtService.sign(payload);
      await this.redisCacheService.delete(refreshToken);
      await this.redisCacheService.set(newRefreshToken, newToken);
      return { newToken, newRefreshToken };
    }
  }
}
