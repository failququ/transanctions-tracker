import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(5, { message: 'Password length must be at least 5 characters' })
  password: string;
}
