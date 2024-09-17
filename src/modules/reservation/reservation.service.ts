import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from 'src/modules/event/entities/event.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationSolver, paginationGenerator } from 'src/common/utils/pagination.util';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationStatus } from './enums/reservation-status.enum';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity) private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const { eventId, userId, quantity } = createReservationDto;
    if (quantity <= 0) {
      throw new BadRequestException('Quantity Must be greater than 0!');
    }
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) throw new NotFoundException(NotFoundMessage.NotFoundEvent);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User Not Found!');
    const totalPrice = event.price * quantity;
    const reservation = this.reservationRepository.create({
      event,
      user,
      quantity,
      totalPrice,
      status: ReservationStatus.PENDING
    });
    await this.reservationRepository.save(reservation);
    return { message: PublicMessage.Created };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [reservations, count] = await this.reservationRepository.findAndCount({
      skip,
      take: limit,
      relations: ['event', 'user'],
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      reservations,
    };
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }
}
