require "connection_pool"

REDIS_PRIMARY = ConnectionPool::Wrapper.new(size: 5, timeout: 3) do
  Redis.new(url: ENV.fetch("REDIS_URL", "redis://localhost:6379/0"))
end

REDIS_READ = ConnectionPool::Wrapper.new(size: 5, timeout: 3) do
  Redis.new(url: ENV.fetch("REDIS_REPLICA_URL", ENV.fetch("REDIS_URL", "redis://localhost:6379/0")))
end

REDIS = REDIS_PRIMARY

# Read from the replica, fall back to primary if it's down.
module RedisCache
  module_function

  def read(key)
    REDIS_READ.get(key)
  rescue Redis::BaseConnectionError => e
    Rails.logger.warn("Redis replica read failed (#{e.class}), falling back to primary")
    begin
      REDIS_PRIMARY.get(key)
    rescue Redis::BaseConnectionError
      nil
    end
  end
end