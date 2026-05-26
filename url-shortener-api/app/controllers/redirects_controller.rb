class RedirectsController < ApplicationController
  # Read path is optimized for low latency: Redis is checked first, and Mongo
  # is only hit on a cache miss (then the result is cached for next time).
  def show
    code = params[:short_code]
    long_url = REDIS.get("url:#{code}")

    if long_url.nil?
      url = Url.find_by(short_code: code)
      return render json: { error: "Link not found!" }, status: :not_found if url.blank?
      return render json: { error: "Link expired!" }, status: :gone if url.expired?

      long_url = url.long_url
      REDIS.setex("url:#{code}", url.cache_ttl, long_url)
    end

    Url.where(short_code: code).inc(visit_count: 1)

    redirect_to long_url, allow_other_host: true, status: :found
  end
end