import json
import time
import asyncio
from typing import Optional, Any
from app.core.config import settings

class InMemoryRedisMock:
    """
    High-performance in-memory cache fallback mimicking Redis async API.
    Guarantees 100% operation even if Redis daemon is not installed locally.
    """
    def __init__(self):
        self._store = {}
        self._expiry = {}

    async def get(self, key: str) -> Optional[str]:
        now = time.time()
        if key in self._expiry and self._expiry[key] < now:
            del self._store[key]
            del self._expiry[key]
            return None
        return self._store.get(key)

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        self._store[key] = value
        if ex:
            self._expiry[key] = time.time() + ex
        elif key in self._expiry:
            del self._expiry[key]
        return True

    async def delete(self, key: str) -> bool:
        self._store.pop(key, None)
        self._expiry.pop(key, None)
        return True

    async def flushall(self):
        self._store.clear()
        self._expiry.clear()


class CacheManager:
    """
    Unified Cache Manager providing async JSON caching with TTL.
    """
    def __init__(self):
        self.client = None
        self.is_real_redis = False

    async def initialize(self):
        try:
            import redis.asyncio as aioredis
            client = aioredis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
            # Test connection with short timeout
            await asyncio.wait_for(client.ping(), timeout=1.0)
            self.client = client
            self.is_real_redis = True
            print("[RedisCache] Connected to Redis server successfully.")
        except Exception:
            self.client = InMemoryRedisMock()
            self.is_real_redis = False
            print("[RedisCache] Redis daemon not available. Activated high-performance async in-memory cache fallback.")

    async def get_json(self, key: str) -> Optional[Any]:
        if not self.client:
            await self.initialize()
        val = await self.client.get(key)
        if val:
            try:
                return json.loads(val)
            except Exception:
                return val
        return None

    async def set_json(self, key: str, value: Any, ttl_seconds: int = 300) -> bool:
        if not self.client:
            await self.initialize()
        serialized = json.dumps(value) if not isinstance(value, str) else value
        return await self.client.set(key, serialized, ex=ttl_seconds)

    async def delete(self, key: str) -> bool:
        if not self.client:
            await self.initialize()
        return await self.client.delete(key)

cache_manager = CacheManager()
