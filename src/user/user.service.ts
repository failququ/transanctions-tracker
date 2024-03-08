import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const isUserExist = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (isUserExist) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await argon2.hash(password);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ email });

    return { user, token };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
}
