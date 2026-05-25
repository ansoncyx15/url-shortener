class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :email, type: String
  field :password_digest, type: String

  has_many :urls

  index({ email: 1 }, { unique: true })

  validates :email, presence: true, uniqueness: true

  def password=(pwd_param)
    self.password_digest = BCrypt::Password.create(pwd_param) if pwd_param.present?
  end

  def authenticate(pwd_param)
    BCrypt::Password.new(password_digest.to_s) == pwd_param
  rescue BCrypt::Errors::InvalidHash
    false
  end

  def issue_token!
    token = SecureRandom.urlsafe_base64(24)
    REDIS.setex("session:#{token}", 7.days.to_i, id.to_s)
    token
  end

  def self.find_by_token(token)
    return nil if token.blank?

    user_id = REDIS.get("session:#{token}")
    return nil if user_id.blank?

    where(id: user_id).first
  end
end