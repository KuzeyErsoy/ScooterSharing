import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
    UseGuards,
    Get,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(
        @Body()
        body: {
            username: string;
            password: string;
            role: 'user' | 'operator';
            operatorCode?: string;
        },
    ) {
        return this.authService.register(
            body.username,
            body.password,
            body.role,
            body.operatorCode,
        );
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user; // token'dan gelen payload
    }
}
