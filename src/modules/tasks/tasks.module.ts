import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationMiddleware } from '../../middlewares/authorization.middleware';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository]), AuthModule,RedisModule],
  controllers: [TasksController],
  providers: [TasksService, AuthorizationMiddleware],
})
export class TasksModule {}
