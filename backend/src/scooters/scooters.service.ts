import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scooter } from './entities/scooter.entity';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';

@Injectable()
export class ScootersService {
  constructor(
      @InjectRepository(Scooter)
      private scooterRepo: Repository<Scooter>,
  ) {}

  async create(dto: CreateScooterDto) {
    const scooter = this.scooterRepo.create(dto);
    return this.scooterRepo.save(scooter);
  }

  async findAll(): Promise<Scooter[]> {
    return this.scooterRepo.find();
  }

  async findOne(id: number): Promise<Scooter> {
    const scooter = await this.scooterRepo.findOneBy({ id });
    if (!scooter) throw new NotFoundException(`Scooter with ID ${id} not found`);
    return scooter;
  }

  async update(id: number, dto: UpdateScooterDto): Promise<Scooter> {
    const scooter = await this.findOne(id);
    Object.assign(scooter, dto);
    return this.scooterRepo.save(scooter);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scooterRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Scooter with ID ${id} not found`);
    }
  }
}
