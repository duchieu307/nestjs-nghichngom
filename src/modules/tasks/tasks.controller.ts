import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from 'src/modules/tasks/tasks.service';
import { CreateTaskDTO } from 'src/modules/tasks/dto/create-task.dto';
import { TaskStatusValidationPipe } from 'src/pipes/task-status-validation.pipe';
import { Task } from 'src/modules/tasks/task.entity';
import { TaskStatus } from 'src/const/task-status.enum';
import { GetTaskFilterDto } from 'src/modules/tasks/dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationMiddleware } from 'src/middlewares/authorization.middleware';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/const/roles.enum';
import { TaskList } from 'src/modules/tasks/pagination/TaskList.dto';
import { RedisService } from 'src/redis/redis.service';
import { HttpResponse } from 'src/modules/HttpResponse';

@Controller('tasks')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(AuthGuard(), AuthorizationMiddleware)
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private readonly redisCacheService: RedisService,
  ) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
  ): Promise<HttpResponse<TaskList>> {
    const data = await this.tasksService.getTasks(filterDto);
    return {
      statusCode: 200,
      message: 'Success',
      data: data,
    };
  }

  // @UseGuards(AuthorizationMiddleware)
  @Get('/test/admin')
  // @Roles(Role.Admin,Role.User)
  @Roles(Role.Admin)
  async getAdmin(@Req() req): Promise<any> {
    await this.redisCacheService.set('test', 'admin');
    return 'halo admin';
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: number): Promise<HttpResponse<Task>> {
    const data = await this.tasksService.getTaskById(id);
    return {
      statusCode: 200,
      message: 'Success',
      data: data,
    };
  }

  @Post()
  async createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    // @Body('title') title: string,
    // @Body('description') description: string
  ): Promise<HttpResponse<Task>> {
    const data = await this.tasksService.createTask(createTaskDTO);
    return {
      statusCode: 201,
      message: 'Tạo Task thành công',
      data: data,
    };
  }

  @Patch('/:id/status')
  async updateTaskById(
    @Param('id') id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<HttpResponse<Task>> {
    const data = await this.tasksService.updateTask(id, status);
    return {
      statusCode: 200,
      message: 'Update Task thành công',
      data: data,
    };
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: number): Promise<HttpResponse<any>> {
    const message = await this.tasksService.deleteTask(id);
    return {
      statusCode: 200,
      message: message,
      data: '',
    };
  }
}
