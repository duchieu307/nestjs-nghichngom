import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from 'src/modules/tasks/dto/create-task.dto';
import { TaskRepository } from 'src/modules/tasks/task.repository';
import { Task } from 'src/modules/tasks/task.entity';
import { TaskStatus } from 'src/const/task-status.enum';
import { GetTaskFilterDto } from 'src/modules/tasks/dto/get-task-filter.dto';
import { TaskList } from 'src/modules/tasks/pagination/TaskList.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(getTaskFilterDto?: GetTaskFilterDto): Promise<TaskList> {
    let data = this.taskRepository.getTasks(getTaskFilterDto);
    return data;
  }

  getTaskById(id: number): Promise<Task> {
    let task = this.taskRepository.findOne(id);
    if (!task) {
      throw new NotFoundException(`khong tim thay id ${id}`);
    } else {
      return task;
    }
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    // truyen vao du cac cot trong db thi phai ?
    const task = await this.taskRepository.create({
        title : createTaskDto.title,
        description : createTaskDto.description,
        status : TaskStatus.OPEN
    });
    return task;
  }

  async updateTask(id: number, status: TaskStatus): Promise<Task> {
    let newTask = await this.getTaskById(id);
    newTask.status = status;
    newTask.save();
    return newTask;
  }

  async deleteTask(id: number): Promise<any> {
    let result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException("Không tìm thấy Task")
    }

    return 'Xóa Task thành công';
  }
}
