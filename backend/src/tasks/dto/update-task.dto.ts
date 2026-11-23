
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    MaxLength,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title?: string;

    @IsOptional()
    @IsString()
    description?: string | null;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}
