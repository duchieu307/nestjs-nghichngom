import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserForCreation } from './dto/user-for-creation.dto';
import { Test } from '@nestjs/testing';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @UsePipes(ValidationPipe)
  signUp(@Body() userForCreation: UserForCreation) {
    return this.authService.signUp(userForCreation);
  }

  @Post('/sign-in')
  signIn(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(username, password);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req){
      console.log(req);
  }
}
