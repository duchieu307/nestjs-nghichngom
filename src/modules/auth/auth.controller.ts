import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
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
  ): Promise<HttpResponse<{ accessToken: string }>> {
    await this.redisCacheService.set('test', 'dang nhap');
    console.log(process.env.DATABASE_USER);
    const accessToken = await this.authService.signIn(username, password);
    return {
      statusCode: 201,
      message: 'Đăng nhập thành công',
      data: accessToken,
    };
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
