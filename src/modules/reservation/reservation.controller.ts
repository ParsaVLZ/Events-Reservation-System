import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/common/enums/role.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  @AuthDecorator()
  @CanAccess(Roles.ADMIN)
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reservationService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

}