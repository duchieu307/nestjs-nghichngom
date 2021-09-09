import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from 'src/modules/tasks/dto/create-task.dto';
import { TaskStatus } from 'src/const/task-status.enum';
import { Task } from 'src/modules/tasks/task.entity';
import { GetTaskFilterDto } from 'src/modules/tasks/dto/get-task-filter.dto';
import { TaskList } from 'src/modules/tasks/pagination/TaskList.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(
    getTaskFilterDto?: GetTaskFilterDto,
  ): Promise<TaskList> {

    const limit = getTaskFilterDto.limit ;
    const page = getTaskFilterDto.page ;
    const status = getTaskFilterDto.status;
    const search = getTaskFilterDto.search;

    //offset day ne
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
      tasks: tasks,
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
