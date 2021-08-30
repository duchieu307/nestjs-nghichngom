import {
  Body,
  Controller,
  Delete,
  Get,
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
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from '../const/task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationMiddleware } from 'src/middlewares/authorization.middleware';
import { Roles } from './role.decorator';
import { Role } from '../const/roles.enum';

@Controller('tasks')
@UseGuards(AuthGuard(), AuthorizationMiddleware)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Promise<Task[]> {
    console.log(filterDto);
    return this.tasksService.getTasks(filterDto);
  }

  // @UseGuards(AuthorizationMiddleware)
  @Get('/test/admin')
  // @Roles(Role.Admin,Role.User)
  @Roles(Role.Admin)
  getAdmin(@Req() req): any {
    console.log(req.user);
    return 'May la thang admin';
  }

  @Get('/:id')
  getTaskById(@Param('id') id: number): Promise<Task> {
    console.log(typeof(id))
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    // @Body('title') title: string,
    // @Body('description') description: string
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Patch('/:id/status')
  updateTaskById(
    @Param('id') id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ) {
    return this.tasksService.updateTask(id, status);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: number): Promise<any> {
    console.log('delete id:', id);
    return this.tasksService.deleteTask(id);
  }
}
