import { ConfigModule } from '@nestjs/config';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from 'src/config/typeorm.config';
import { TasksModule } from 'src/modules/tasks/tasks.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TasksModule,
    AuthModule,
    RedisModule,
  ],
  providers: [RedisService],
})
export class AppModule {}
