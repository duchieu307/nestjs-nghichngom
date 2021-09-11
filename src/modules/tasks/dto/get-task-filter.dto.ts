import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from 'src/const/task-status.enum';
import { Pagination } from 'src/pipes/pagination.pipe';

export class GetTaskFilterDto extends Pagination {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  search = 'a';

  constructor() {
    super();
    console.log(this.page);
  }
}
