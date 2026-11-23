
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    MaxLength,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}
