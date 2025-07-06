import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    // Bu endpoint'e sadece geçerli token ile erişilebilir
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req: any) {
        return req.user; // jwt.strategy.ts'deki payload döner
    }

}
