import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

type CreateCredentialsUserInput = {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findByEmailOrPhone(login: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: login }],
      },
    });
  }

  async createCredentialsUser(input: CreateCredentialsUserInput) {
    return this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.passwordHash,
        role: 'user',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({ where: { id: id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user || !user.password) {
      throw new BadRequestException('User not found or password not set');
    }

    //compare old password

    const saltRounds =
      this.configService.get<number>('bcrypt.saltRounds') || 12;
    const newPasswordHash = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltRounds,
    );

    return this.prisma.user.update({
      where: { id: id },
      data: { password: newPasswordHash },
    });
  }
}
