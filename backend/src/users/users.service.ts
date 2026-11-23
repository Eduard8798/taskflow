
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'node:crypto';

import { User } from './models/user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
    ) {}

    async findByPhone(phone: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { phone },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findByPk(id);
    }

    async create(
        phone: string,
        passwordHash: string,
    ): Promise<User> {
        return this.userModel.create({
            id: randomUUID(),
            phone,
            passwordHash,
        });
    }
}
