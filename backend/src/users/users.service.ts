import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(data: { username: string; password: string; role: 'user' | 'operator' }) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }


    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }

}
