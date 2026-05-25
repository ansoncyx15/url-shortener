require_relative "boot"

require "rails"
require "action_controller/railtie"

# Mongoid replaces ActiveRecord, so ActiveRecord is intentionally not required.
Bundler.require(*Rails.groups)

module UrlShortener
  class Application < Rails::Application
    config.load_defaults 7.1

    # API-only: no views, cookies, or sessions middleware.
    config.api_only = true
  end
end
