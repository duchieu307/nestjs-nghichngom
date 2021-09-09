import { Entity, EntityRepository, Repository } from 'typeorm';
import { UserForCreation } from 'src/modules/auth/dto/user-for-creation.dto';
import { User } from 'src/modules/auth/user.entity';
import * as bcrypt from 'bcrypt'; 
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userForCreationDto: UserForCreation) {
    const { username, password } = userForCreationDto;


    const user = new User();
    let salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await bcrypt.hash(password,salt);
    user.role = 'user';

    try {
      await user.save();
    } catch (error) {
        if (error.sqlState === '23000'){
            throw new ConflictException("Username da ton tai");
        } else {
            throw new InternalServerErrorException();
        }
    }
  }

}
