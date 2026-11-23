
import {
    IsString,
    Matches,
    MinLength,
    MaxLength,
} from 'class-validator';

export class RegisterDto {
    @IsString()
    @Matches(/^\+[1-9]\d{7,14}$/, {
        message: 'Phone must be in international format',
    })
    phone: string;

    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string;
}
