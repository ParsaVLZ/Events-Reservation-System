  import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
  import { EventService } from './event.service';
  import { CreateEventDto } from './dto/create-event.dto';
  import { UpdateEventDto } from './dto/update-event.dto';
  import { ApiConsumes, ApiTags } from '@nestjs/swagger';
  import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
  import { PaginationDto } from 'src/common/dtos/pagination.dto';
  import { Pagination } from 'src/common/decorators/pagination.decorator';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { RoleGuard } from '../auth/guards/role.guard';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

  @Controller('events')
  @ApiTags('Event')
  export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    @AuthDecorator()
    @CanAccess(Roles.ADMIN)
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    create(@Body() createEventDto: CreateEventDto) {
      return this.eventService.create(createEventDto);
    }

    @Get()
    @Pagination()
    findAll(@Query() paginationDto: PaginationDto) {
      return this.eventService.findAll(paginationDto);
    }
    @Get('/date-range')
    findByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
      return this.eventService.findByDateRange(startDate, endDate);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.eventService.findOne(id);
    }
    @Patch(':id')
    @AuthDecorator()
    @CanAccess(Roles.ADMIN)
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto) {
      return this.eventService.update(id, updateEventDto);
    }
    @Delete(':id')
    @AuthDecorator()
    @CanAccess(Roles.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.eventService.remove(id);
    }
    @Get('/category/:categoryId')
    findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
      return this.eventService.findByCategory(categoryId);
    }
  }
