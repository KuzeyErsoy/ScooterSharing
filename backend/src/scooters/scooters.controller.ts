import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ScootersService } from './scooters.service';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('scooters')
@UseGuards(JwtAuthGuard) // Tüm scooter işlemleri token gerektirir
export class ScootersController {
  constructor(private readonly scootersService: ScootersService) {}

  @Post()
  create(@Body() dto: CreateScooterDto) {
    return this.scootersService.create(dto);
  }

  @Get()
  async findAll(@Request() req) {
    const all = await this.scootersService.findAll();
    const role = req.user.role;

    if (role === 'user') {
      return all.filter((scooter) => scooter.battery >= 20);
    }

    return all;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scootersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScooterDto) {
    return this.scootersService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scootersService.remove(+id);
  }
}
