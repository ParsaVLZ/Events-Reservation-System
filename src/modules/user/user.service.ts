import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationSolver, paginationGenerator } from 'src/common/utils/pagination.util';
import { PublicMessage, NotFoundMessage } from 'src/common/enums/message.enum';
import { OtpEntity } from './entities/otp.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [users, count] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      users,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(NotFoundMessage.NotFoundUser);
    return user;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.delete({ id: user.id });
    return { message: PublicMessage.Deleted };
  }
}
