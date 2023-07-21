import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);

    if (!result) {
      throw new HttpException('User invalid', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Get()
  async findAll() {
    const results = await this.usersService.findAll();

    if (!results) {
      throw new HttpException('No User found', HttpStatus.NOT_FOUND);
    }

    return results;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(+id);

    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @Patch('edit/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateUserDto);

    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(+id);

    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
