import { Task } from '../task.entity';
export class PaginationResultDto {
    data: Task[];
    page: number;
    limit: number;
    total: number;

}