import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserForCreation } from './dto/user-for-creation.dto';
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
    let user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new UnauthorizedException('Username không tồn tại');
    } else {
      let match = await bcrypt.compare(password, user.password);
      console.log(match);
      if (match) {
        let role = user.role;
        let id = user.id;
        let payload = { username, role, id };
        let accessToken = await this.jwtService.sign(payload);
        return { accessToken };
      } else {
        throw new UnauthorizedException('Sai password');
      }
    }
  }
}
