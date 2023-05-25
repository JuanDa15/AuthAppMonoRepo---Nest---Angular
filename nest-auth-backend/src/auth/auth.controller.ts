import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Request } from 'express';
import { User } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
     private jwtService: JwtService) {}

  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  logIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('/register')
  register(@Body() registerDto: RegisterUserDTO) {
    return this.authService.register( registerDto )
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll(@Req() request: Request) {
    return this.authService.findAll();
  }

  @UseGuards( AuthGuard )
  @Get('check-token')
  async checkToken(@Req() req: Request) {
    const user = req['user'] as User;
    delete req['user'];
    return this.authService.checkToken(user)
  }





  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
