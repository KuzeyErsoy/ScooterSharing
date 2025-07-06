import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Scooter } from './scooters/entities/scooter.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ScootersModule } from './scooters/scooters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database configuration using environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '5432'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Scooter],
        synchronize: true,
      }),
    }),

    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    ScootersModule,
  ],
})
export class AppModule {}