import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from '../../const/task-status.enum';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { PaginationResultDto } from './pagination/paginationResult.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(
    getTaskFilterDto?: GetTaskFilterDto,
  ): Promise<PaginationResultDto> {
    let { status, search } = getTaskFilterDto;

    const limit = getTaskFilterDto.limit ? Number(getTaskFilterDto.limit) : 10;
    const page = getTaskFilterDto.page ? Number(getTaskFilterDto.page) : 1;
    const skippedItems = (page - 1) * limit;

    let query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    //typeORM querry builder
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query
      .offset(skippedItems)
      .limit(limit < 10 ? limit : 10)
      .getMany();
    const total = await this.count();
    
    return {
      data: tasks,
      total: total,
      page: page,
      limit: limit,
    };
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    let { title, description } = createTaskDto;

    let newTask = new Task();
    newTask.title = title;
    newTask.description = description;
    newTask.status = TaskStatus.OPEN;
    await newTask.save();

    return newTask;
  }
}
