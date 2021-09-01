import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../modules/auth/user.repository';


// code giống doc
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'can1cogaivuto',
    });
  }

  async validate(payload) {
    let { username } = payload;
    let user = await this.userRepository.findOne({username: username})
    if (!user){
      console.log("Guard chay");
        throw new UnauthorizedException('User không tồn tai');
    } else {
        console.log("Guard chay");
        return user;
    }
  }
}
