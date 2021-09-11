import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/auth/user.repository';
import { UserForCreation } from 'src/modules/auth/dto/user-for-creation.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userForCreation: UserForCreation) {
    return this.userRepository.signUp(userForCreation);
  }

  //   async findUserWithUsername(username: string) {
  //     let user = await this.userRepository.find(
  //         { where: { username: username }
  //     });
  //     if(!user){
  //         return null;
  //     } else {
  //         return user;
  //     }
  //   }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
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
        const payload = { username, role, id };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
      } else {
        throw new UnauthorizedException('Sai password');
      }
    }
  }
}
