class ApplicationController < ActionController::API
  private

  # Raw token from the "Authorization: Bearer <token>" header (user or guest).
  def bearer_token
    request.headers["Authorization"].to_s.split(" ").last
  end

  # Resolves the current user from the bearer token. Nil for guest/anonymous.
  def current_user
    return @current_user if defined?(@current_user)

    @current_user = User.find_by_token(bearer_token)
  end

  # The bearer token if it's a live guest session (guest:<token> in Redis), else
  # nil. Lets anonymous visitors own the links they create without an account.
  def current_guest_token
    return @current_guest_token if defined?(@current_guest_token)

    @current_guest_token = bearer_token.present? && REDIS.exists?("guest:#{bearer_token}") ? bearer_token : nil
  end

  def require_user!
    return if current_user

    render json: { error: "unauthorized" }, status: :unauthorized
  end
end