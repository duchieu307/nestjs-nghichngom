import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { TasksModule } from 'src/modules/tasks/tasks.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule,
    AuthModule,
    RedisModule,
  ],
  providers: [],
})
export class AppModule {}
