import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { EventStatus } from './enum/event-status.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import * as moment from 'moment';


@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>
  ) {}

  async create(createEventDto: CreateEventDto) {
    const { name, description, location, price, startTime, endTime, status, categoryId } = createEventDto;
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new BadRequestException(NotFoundMessage.NotFoundCategory);
    }
    const start = moment(startTime, 'YYYY-MM-DDTHH:mm').toDate();
    const end = moment(endTime, 'YYYY-MM-DDTHH:mm').toDate();
    const event = this.eventRepository.create({
      name,
      description,
      location,
      price,
      startTime: start,
      endTime: end,
      status: status || EventStatus.OPEN,
      category
    });
    await this.eventRepository.save(event);
    return { message: PublicMessage.Created };
}

async findAll(paginationDto: PaginationDto) {
  const { limit, page, skip } = paginationSolver(paginationDto);

  const [events, count] = await this.eventRepository.findAndCount({
    skip,
    take: limit,
    relations: ['category'],
  });
  return {
    pagination: paginationGenerator(count, page, limit),
    events,
  };
}

  async findOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!event) {
      throw new NotFoundException(NotFoundMessage.NotFoundEvent);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    const { name, description, location, price, startTime, endTime, status, categoryId } = updateEventDto;
    if (name) event.name = name;
    if (description) event.description = description;
    if (location) event.location = location;
    if (price) event.price = price;
    if (startTime) event.startTime = moment(startTime, 'YYYY-MM-DDTHH:mm').toDate();
    if (endTime) event.endTime = moment(endTime, 'YYYY-MM-DDTHH:mm').toDate();
    if (status) event.status = status;
    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (!category) throw new BadRequestException(NotFoundMessage.NotFoundCategory);
      event.category = category;
    }
    await this.eventRepository.save(event);
    return { message: PublicMessage.Updated };
  }

async remove(id: number) {
  const event = await this.findOne(id);
  await this.eventRepository.delete({ id: event.id });
  return { message: PublicMessage.Deleted };
}

  async findByCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory);

    const events = await this.eventRepository.find({
      where: { category },
      relations: ['category', 'reservations'],
    });

    return events;
  }

  async findByDateRange(startDate: string, endDate: string) {
    if (!moment(startDate, 'YYYY-MM-DD', true).isValid() || !moment(endDate, 'YYYY-MM-DD', true).isValid()) {
      throw new BadRequestException('Invalid date format!');
    }  
    const start = moment(startDate, 'YYYY-MM-DD').startOf('day').toDate();
    const end = moment(endDate, 'YYYY-MM-DD').endOf('day').toDate();
    const events = await this.eventRepository.find({
      where: {
        startTime: Between(start, end),
      },
      relations: ['category'],
    });
    return events;
  }
}