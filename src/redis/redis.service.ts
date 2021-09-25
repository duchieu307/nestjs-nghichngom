import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key) {
    return await this.cache.get(key);
  }

  async set(key, value) {
      //ttl in second
    await this.cache.set(key, value, { ttl: 1000000 });
  }

  async delete(key){
    await this.cache.del(key)
  }
}
