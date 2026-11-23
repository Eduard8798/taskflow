
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { User } from '../../users/models/user.model';
import { TaskStatus } from '../enums/task-status.enum';

@Table({
    tableName: 'tasks',
    timestamps: true,
    underscored: true,
})
export class Task extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column(DataType.STRING(150))
    declare title: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    declare description: string | null;

    @AllowNull(false)
    @Default(TaskStatus.TODO)
    @Column(DataType.ENUM(...Object.values(TaskStatus)))
    declare status: TaskStatus;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare userId: string;

    @BelongsTo(() => User)
    declare user: User;
}
