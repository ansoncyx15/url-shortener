max_threads = ENV.fetch("RAILS_MAX_THREADS", 5).to_i
min_threads = ENV.fetch("RAILS_MIN_THREADS", max_threads).to_i
threads min_threads, max_threads

# Bind to all interfaces so the container is reachable from the host.
bind "tcp://0.0.0.0:#{ENV.fetch('PORT', 3001)}"

environment ENV.fetch("RAILS_ENV", "development")

plugin :tmp_restart
