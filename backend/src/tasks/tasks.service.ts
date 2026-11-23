
import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'node:crypto';

import { Task } from './models/task.model';
import { TaskStatus } from './enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task)
        private readonly taskModel: typeof Task,
    ) {}

    async create(userId: string, dto: CreateTaskDto) {
        return this.taskModel.create({
            id: randomUUID(),
            userId,
            title: dto.title,
            description: dto.description ?? null,
            status: dto.status ?? TaskStatus.TODO,
        });
    }

    async findAll(userId: string) {
        return this.taskModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
    }

    async findOne(id: string, userId: string) {
        const task = await this.taskModel.findOne({
            where: {
                id,
                userId,
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    async update(
        id: string,
        userId: string,
        dto: UpdateTaskDto,
    ) {
        const task = await this.findOne(id, userId);

        await task.update(dto);

        return task;
    }

    async remove(id: string, userId: string) {
        const task = await this.findOne(id, userId);

        await task.destroy();
    }
}
