import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from '../../const/task-status.enum';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(getTaskFilterDto?: GetTaskFilterDto): Promise<Task[]> {
    let { status, search } = getTaskFilterDto;
    //query chi den 1 bang trong db
    let query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    //typeORM querry builder
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    let tasks = await query.getMany();
    return tasks;
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
