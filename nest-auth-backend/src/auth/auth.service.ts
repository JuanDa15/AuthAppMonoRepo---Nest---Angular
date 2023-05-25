import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/auth.entity';
import { Model } from 'mongoose';
import { compareSync, hashSync } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ClientResponse } from 'src/interfaces/server-response';
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async create({password, ...user}: CreateUserDto): Promise<User> {
    try {
      const encryptPassword = hashSync(password, 10);
      const newUser = new this.userModel({
        ...user,
        password: encryptPassword
      });
      await newUser.save();
      const { password:_, ...other } = newUser.toJSON();
      return other;
    } catch ( error ) {
      if (error.code === 11000) {
        throw new BadRequestException(`${user.email} already exist`);
      }
      throw new InternalServerErrorException('Something terrible happens!!')
    }
  }

  async login({ email, password }: LoginDto): Promise<ClientResponse<unknown>> {

    try {
      const user = await this.userModel.findOne({ email: email})

      if (!user) {
        throw new UnauthorizedException('Not valid credentials');
      }

      if (!compareSync(password, user.password)) {
        throw new UnauthorizedException('Not valid credentials');
      }

      const { password:_, ...rest } = user.toJSON();

      const token = await this.jwtService.signAsync({
        ...rest
      });


      return {
        ok: true,
        data: rest,
        token: token
      };


    } catch ( error ) {
      console.log(error)
      if(error.status === HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException('Not valid credentials');
      }
    }
  }

  async register(registerDto: RegisterUserDTO): Promise<ClientResponse<unknown>> {
    const user = await this.create( registerDto )

    return {
      ok: true,
      data: user,
      token: await this.jwtService.signAsync({
        user
      })

    }
  }

  async checkToken(user: User) {
    return {
      ok: true,
      data: user,
      token: await this.jwtService.signAsync({
        user
      })
    }
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
