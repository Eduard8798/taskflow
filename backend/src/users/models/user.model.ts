
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    Unique,
    AllowNull,
} from 'sequelize-typescript';
import { HasMany } from 'sequelize-typescript';
import { Task } from '../../tasks/models/task.model';
@Table({
    tableName: 'users',
    timestamps: true,
    underscored: true,
})
export class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(20))
    declare phone: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        field: 'password_hash',
    })
    declare passwordHash: string;

    @HasMany(() => Task)
    declare tasks: Task[];
}
