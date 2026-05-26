class UrlsController < ApplicationController
  def index
    scope =
      if current_user
        current_user.urls
      elsif current_guest_token
        Url.where(guest_token: current_guest_token)
      end

    return render json: { error: "unauthorized" }, status: :unauthorized if scope.nil?

    # Optional search across alias (short_code) and destination (long_url).
    q = params[:q].to_s.strip
    if q.present?
      pattern = /#{Regexp.escape(q)}/i
      scope = scope.any_of({ short_code: pattern }, { long_url: pattern })
    end

    page = [params[:page].to_i, 1].max # defensive input handling
    per_page = params[:per_page].to_i
    per_page = 10 if per_page <= 0
    per_page = [per_page, 50].min

    total = scope.count
    records = scope.order(created_at: :desc).skip((page - 1) * per_page).limit(per_page)

    render json: {
      data: records.map { |u| serialize(u) },
      pagination: {
        page:,
        per_page:,
        total:,
        total_pages: total.zero? ? 0 : (total.to_f / per_page).ceil,
      },
    }
  end

  def create
    return render json: { error: "unauthorized" }, status: :unauthorized unless current_user || current_guest_token

    long_url = url_param(:long_url)
    custom_alias = url_param(:custom_alias)
    expires_in = url_param(:expires_in)

    if long_url.blank?
      return render json: { error: "Long url is required!" }, status: :unprocessable_entity
    end

    short_code = custom_alias.presence || ShortCodeGenerator.generate
    if Url.where(short_code: short_code).exists?
      return render json: { error: "Alias '#{short_code}' is already taken" }, status: :conflict
    end

    url = Url.new(
      long_url:,
      short_code:,
      user: current_user,
      guest_token: current_user ? nil : current_guest_token,
      expires_at: expires_in.present? ? Time.now + expires_in.to_i.seconds : nil,
    )

    if url.save
      REDIS.setex("url:#{url.short_code}", url.cache_ttl, url.long_url)
      render json: serialize(url), status: :created
    else
      render json: { errors: url.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def url_param(key)
    params.dig(:url, key) || params[key]
  end

  def serialize(url)
    {
      id: url.id.to_s,
      longUrl: url.long_url,
      shortCode: url.short_code,
      shortUrl: "#{request.base_url}/#{url.short_code}",
      isExpired: url.expired?,
      expiresAt: url.expires_at,
      visitCount: url.visit_count,
      createdAt: url.created_at,
    }
  end
end