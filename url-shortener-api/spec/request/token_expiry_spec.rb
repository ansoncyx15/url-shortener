require "rails_helper"

# Expiry lives in Redis TTLs (session:<token> 7d, guest:<token> 1d).
# Don't need to wait for real time — we either read the TTL back, or delete the key to simulate the token having expired.
RSpec.describe "Token expiry", type: :request do
  describe "user session" do
    let(:password) { "secret123" }
    let(:user) { User.create!(email: "user@example.com", password:) }

    it "issues a session token with a TTL of about 7 days" do
      post "/api/auth/login", params: { email: user.email, password: }, as: :json

      expect(response).to have_http_status(:ok)
      token = response.parsed_body["token"]
      ttl = REDIS.ttl("session:#{token}")
      expect(ttl).to be > 0
      expect(ttl).to be <= 7.days.to_i
    end

    it "rejects requests once the session token has expired" do
      token = user.issue_token!
      REDIS.del("session:#{token}") # simulate the 7 days elapsing

      get "/api/urls", headers: { "Authorization" => "Bearer #{token}" }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "guest session" do
    def mint_guest_token
      post "/api/auth/guest"
      response.parsed_body["token"]
    end

    it "issues a guest token with a TTL of about 1 day" do
      token = mint_guest_token

      expect(response).to have_http_status(:created)
      ttl = REDIS.ttl("guest:#{token}")
      expect(ttl).to be > 0
      expect(ttl).to be <= 1.day.to_i
    end

    it "attributes a created link to the guest while the token is live" do
      token = mint_guest_token

      post "/api/urls",
           params: { long_url: "https://example.com" },
           headers: { "Authorization" => "Bearer #{token}" },
           as: :json

      expect(response).to have_http_status(:created)
      expect(Url.last.guest_token).to eq(token)
    end

    it "rejects link creation once the guest token has expired" do
      token = mint_guest_token
      REDIS.del("guest:#{token}") # simulate the 1 day elapsing

      post "/api/urls",
           params: { long_url: "https://example.com" },
           headers: { "Authorization" => "Bearer #{token}" },
           as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end