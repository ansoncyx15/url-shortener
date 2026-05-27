# This file is copied to spec/ when you run 'rails generate rspec:install'
require 'spec_helper'

ENV['RAILS_ENV'] ||= 'test'

require_relative '../config/environment'

abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'

Rails.root.glob('spec/support/**/*.rb').sort_by(&:to_s).each { |f| require f }

RSpec.configure do |config|
  config.use_active_record = false
  config.before(:each) do
    Mongoid.purge! # wipe the test Mongo DB
    REDIS.flushdb # wipe the test Redis DB
  end

  # Need this!
  # Controller specs temporarily override the route table via routes.draw.
  # Reload after each controller spec so request specs always see the application routes.
  config.after(:each, type: :controller) do
    Rails.application.reload_routes!
  end

  config.infer_spec_type_from_file_location!

  config.filter_rails_from_backtrace!
end