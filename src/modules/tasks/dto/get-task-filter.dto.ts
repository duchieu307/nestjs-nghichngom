import { IsIn, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../../const/task-status.enum';
 

export class GetTaskFilterDto{
    @IsOptional()
    @IsIn([TaskStatus.OPEN,TaskStatus.IN_PROGRESS,TaskStatus.DONE])
    status: TaskStatus;

    search: string;
}