import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'The email address of the user.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123@abcd',
    description: 'The password for the user. It should be at least 8 characters long.',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}