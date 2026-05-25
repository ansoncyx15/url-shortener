class SessionsController < ApplicationController
  def signup
    user = User.new(email: params[:email], password: params[:password])

    if user.save
      render json: { token: user.issue_token!, email: user.email }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password].to_s)
      render json: { token: user.issue_token!, email: user.email }
    else
      render json: { error: "Email or password invalid!" }, status: :unauthorized
    end
  end

  def guest
    token = SecureRandom.urlsafe_base64(24)
    REDIS.setex("guest:#{token}", 1.day.to_i, "1")

    render json: { token:, guest: true }, status: :created
  end
end