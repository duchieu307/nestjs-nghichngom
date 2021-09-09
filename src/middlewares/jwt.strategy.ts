import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/modules/auth/user.repository';


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
    console.log("Payload: ",payload);
    let { username } = payload;
    let user = await this.userRepository.findOne({username: username})
    if (!user || user.id != payload.id){
      console.log("Guard chay");
        throw new UnauthorizedException('Token không hợp lệ');
    } else {
        console.log("Guard chay");
        return user;
    }
  }
}
