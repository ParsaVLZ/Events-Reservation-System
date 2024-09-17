import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ConflictMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let { title } = createCategoryDto;
    title = await this.checkExistAndResolveTitle(title);
    const category = this.categoryRepository.create({
      title
    });
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Created
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [categories, count] = await this.categoryRepository.findAndCount({
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      categories,
    };
  }

  async insertByTitle(title: string) {
    const category = this.categoryRepository.create({
      title,
    });
    return await this.categoryRepository.save(category);
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory);
    return category;
  }

  async findOneByTitle(title: string) {
    title = title?.trim()?.toLowerCase();
    return await this.categoryRepository.findOneBy({ title });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const { title } = updateCategoryDto;
    if (title) category.title = title;
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Updated
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.categoryRepository.delete({ id });
    return {
      message: PublicMessage.Deleted
    };
  }

  async checkExistAndResolveTitle(title: string) {
    title = title?.trim()?.toLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    if (category) throw new ConflictException(ConflictMessage.CategoryTitle);
    return title;
  }
}
