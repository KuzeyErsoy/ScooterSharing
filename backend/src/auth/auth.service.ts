import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(
        username: string,
        password: string,
        role: 'user' | 'operator',
        operatorCode?: string,
    ) {
        if (role === 'operator') {
            const validCode = process.env.OPERATOR_SECRET;
            if (operatorCode !== validCode) {
                throw new UnauthorizedException('Invalid operator code');
            }
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await this.usersService.create({
            username,
            password: hashed,
            role,
        });

        return { message: 'User registered', id: newUser.id };
    }

    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.usersService.findByUsername(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async login(user: User) {
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            role: user.role,
        };
    }
}
