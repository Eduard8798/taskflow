
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';

import type { Request } from 'express';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        phone: string;
    };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
    ) {}

    @Post()
    create(
        @Body() dto: CreateTaskDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.tasksService.create(req.user.id, dto);
    }

    @Get()
    findAll(@Req() req: AuthenticatedRequest) {
        return this.tasksService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.tasksService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateTaskDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.tasksService.update(
            id,
            req.user.id,
            dto,
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.tasksService.remove(id, req.user.id);
    }
}
