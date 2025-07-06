import { Test, TestingModule } from '@nestjs/testing';
import { ScootersController } from './scooters.controller';
import { ScootersService } from './scooters.service';

describe('ScootersController', () => {
  let controller: ScootersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScootersController],
      providers: [ScootersService],
    }).compile();

    controller = module.get<ScootersController>(ScootersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
