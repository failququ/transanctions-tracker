import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserData } from 'src/types/User';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) throw new BadRequestException('Wrong data has been provided!');

    const isPasswordMatched = await argon2.verify(user.password, password);

    if (user && isPasswordMatched) {
      const { password, ...restUserInfo } = user;
      return restUserInfo;
    }
    throw new BadRequestException('Wrong data has been provided!');
  }

  async login(user: UserData) {
    const { id, email } = user;

    const token = await this.jwtService.sign({ id, email });
    return { id: user.id, email: user.email, token };
  }

  async getProfile(user: UserData) {
    return user;
  }
}
