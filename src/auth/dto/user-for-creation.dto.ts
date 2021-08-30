import { IsString, MaxLength, MinLength } from 'class-validator';

export abstract class UserForCreation {
  @IsString()
  @MinLength(4, { message: 'Ten phai dai hon 4 ky to' })
  @MaxLength(20)
  username: string;

  @MinLength(6, {
    message: 'password phai co nhieu hon 6 ky tu',
  })
  @MaxLength(20)
  password: string;
}
