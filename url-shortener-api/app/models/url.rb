class Url
  include Mongoid::Document
  include Mongoid::Timestamps

  field :long_url,    type: String
  field :short_code,  type: String
  field :expires_at,  type: Time
  field :visit_count, type: Integer, default: 0
  # Owner of a link created without an account (anonymous guest session).
  # Mutually exclusive with `user`.
  field :guest_token, type: String

  belongs_to :user, optional: true

  index({ short_code: 1 }, { unique: true })
  index({ user_id: 1, created_at: -1 })
  index({ guest_token: 1, created_at: -1 })
  index({ expires_at: 1 }, { expire_after_seconds: 1.day.to_i })

  validates :long_url,   presence: true
  validate  :long_url_is_http
  validates :short_code, presence: true, uniqueness: true

  def expired?
    expires_at.present? && expires_at <= Time.now
  end

  # Seconds until expiry, or a default window for non-expiring links.
  # Used as the Redis cache TTL so the cache never outlives the link.
  def cache_ttl(default: 1.day.to_i)
    return default if expires_at.blank?

    [(expires_at - Time.now).to_i, 1].max
  end

  private

  # Only accept well-formed http(s) URLs — rejects other schemes (javascript:,
  # ftp:, data:, …) so a short link can't be turned into an open redirect.
  def long_url_is_http
    return if long_url.blank? # presence validation handles the blank case

    uri = URI.parse(long_url)
    unless uri.is_a?(URI::HTTP) && uri.host.present?
      errors.add(:long_url, "must be a valid http or https URL")
    end
  rescue URI::InvalidURIError
    errors.add(:long_url, "is not a valid URL")
  end
end