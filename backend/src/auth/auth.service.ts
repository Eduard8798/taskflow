
import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UniqueConstraintError } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface RefreshPayload {
    sub: string;
    type: 'refresh';
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByPhone(
            dto.phone,
        );

        if (existingUser) {
            throw new ConflictException('Phone already registered');
        }

        const passwordHash = await bcrypt.hash(dto.password, 12);

        let user: User;

        try {
            user = await this.usersService.create(
                dto.phone,
                passwordHash,
            );
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException('Phone already registered');
            }

            throw error;
        }

        return this.generateTokens(user);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByPhone(dto.phone);

        if (!user) {
            throw new UnauthorizedException(
                'Invalid phone or password',
            );
        }

        const validPassword = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!validPassword) {
            throw new UnauthorizedException(
                'Invalid phone or password',
            );
        }

        return this.generateTokens(user);
    }

    async refresh(refreshToken: string) {
        let payload: RefreshPayload;

        try {
            payload = await this.jwtService.verifyAsync<RefreshPayload>(
                refreshToken,
                {
                    secret: this.configService.getOrThrow<string>(
                        'JWT_REFRESH_SECRET',
                    ),
                },
            );
        } catch {
            throw new UnauthorizedException(
                'Invalid or expired refresh token',
            );
        }

        if (payload.type !== 'refresh' || !payload.sub) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.usersService.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.generateTokens(user);
    }

    private async generateTokens(user: User) {
        const accessPayload = {
            sub: user.id,
            phone: user.phone,
            type: 'access',
        };

        const refreshPayload = {
            sub: user.id,
            type: 'refresh',
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(accessPayload, {
                secret: this.configService.getOrThrow<string>(
                    'JWT_SECRET',
                ),
                expiresIn: '15m',
            }),

            this.jwtService.signAsync(refreshPayload, {
                secret: this.configService.getOrThrow<string>(
                    'JWT_REFRESH_SECRET',
                ),
                expiresIn: '7d',
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
