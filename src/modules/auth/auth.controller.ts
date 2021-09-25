import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  UnauthorizedException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserForCreation } from 'src/modules/auth/dto/user-for-creation.dto';
import { HttpResponse } from 'src/modules/HttpResponse';
import { RedisService } from 'src/redis/redis.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly redisCacheService: RedisService,
  ) {}

  @Post('/sign-up')
  @UsePipes(ValidationPipe)
  async signUp(
    @Body() userForCreation: UserForCreation,
  ): Promise<HttpResponse<any>> {
    await this.authService.signUp(userForCreation);
    return {
      statusCode: 201,
      message: 'Tạo User thành công',
      data: '',
    };
  }

  @Post('/sign-in')
  async signIn(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<HttpResponse<{ accessToken: string; refreshToken: string }>> {
    console.log(process.env.DATABASE_USER);
    const { accessToken, refreshToken } = await this.authService.signIn(
      username,
      password,
    );
    return {
      statusCode: 201,
      message: 'Đăng nhập thành công',
      data: { accessToken, refreshToken },
    };
  }

  @Post('/refresh-token')
  async refreshToken(
    @Req() req,
    @Body('refreshToken', ParseUUIDPipe) refreshToken: string,
  ): Promise<HttpResponse<{ newToken: string; newRefreshToken: string }>> {
    if (!req.headers.authorization.match(/^Bearer /g)) {
      throw new UnauthorizedException('Token ko hop le');
    }
    const token = req.headers.authorization.split(' ')[1];

    const { newToken, newRefreshToken } = await this.authService.refreshToken(
      token,
      refreshToken,
    );
    return {
      statusCode: 201,
      message: 'Cấp mới token thành công',
      data: { newToken, newRefreshToken },
    };
  }

  @Post('/logout')
  @UseGuards(AuthGuard())
  async logOut(
    @Body('refreshToken', ParseUUIDPipe) refreshToken: string,
  ): Promise<HttpResponse<any>> {
    try {
      await this.redisCacheService.delete(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Token ko hop le');
    }
    return {
      statusCode: 200,
      message: 'Đăng xuất thành công',
      data: '',
    };
  }
}
