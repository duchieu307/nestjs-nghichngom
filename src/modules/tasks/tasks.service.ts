import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from '../../const/task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  // promise dùng để manage multiple asynchronous operations
  // generic type xác định kiểu dữ liệu sau khi promise hoàn thành
  // 3 trạng thái promise: reject, pending, hoàn thành
  // await suspends the execution until an asynchronous function 
  // return promise is fulfilled and unwraps the value from the Promise returned.

  //nestjs's features !!!!!!!!!!!!!!!

  async getTasks(getTaskFilterDto?: GetTaskFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(getTaskFilterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    console.log("service", typeof(id));
    let task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(`khong tim thay id ${id}`);
    } else {
      return task;
    }
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
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
      return 'Khong tim thay task';
    }

    return 'Xoa thanh cong';
  }
}
