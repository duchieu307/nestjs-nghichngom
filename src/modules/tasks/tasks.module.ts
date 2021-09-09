import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from 'src/modules/tasks/task.repository';
import { TasksController } from 'src/modules/tasks/tasks.controller';
import { TasksService } from 'src/modules/tasks/tasks.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthorizationMiddleware } from 'src/middlewares/authorization.middleware';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository]), AuthModule,RedisModule],
  controllers: [TasksController],
  providers: [TasksService, AuthorizationMiddleware],
})
export class TasksModule {}
