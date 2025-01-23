import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheKey } from './types';

@Injectable()
export class SysCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * 获取缓存
   * @param key key
   * @returns value
   */
  async get(key: CacheKey) {
    return await this.cacheManager.get(key);
  }

  /**
   * 设置缓存
   * @param key key
   * @param value value
   * @param ttl 过期时间（毫秒）, 0表示不过期
   */
  async set(key: CacheKey, value: any, ttl?: number) {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * 删除缓存
   * @param key key
   */
  async del(key: CacheKey) {
    await this.cacheManager.del(key);
  }

  async clear() {
    await this.cacheManager.clear();
  }
}
