import { Task } from 'src/modules/tasks/task.entity';
export class TaskList {
  tasks: Task[];
  page: number;
  limit: number;
  total: number;
}
