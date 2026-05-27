require "rails_helper"

RSpec.describe ApplicationController, type: :controller do
  controller do
    def index
      render json: {
        bearer_token:,
        current_user: current_user&.email,
        current_guest_token:,
      }
    end
  end

  describe "#bearer_token" do
    it "extracts token from authorization header" do
      request.headers["Authorization"] = "Bearer abc123"

      get :index

      expect(JSON.parse(response.body)["bearer_token"]).to eq("abc123")
    end
  end

  describe "#current_user" do
    let(:user) { instance_double(User, email: "test@example.com") }

    it "returns current user from token" do
      request.headers["Authorization"] = "Bearer token123"

      allow(User).to receive(:find_by_token).with("token123").and_return(user)

      get :index

      expect(JSON.parse(response.body)["current_user"]).to eq("test@example.com")
    end
  end

  describe "#current_guest_token" do
    it "returns guest token when redis key exists" do
      request.headers["Authorization"] = "Bearer guest123"

      allow(REDIS).to receive(:exists?).with("guest:guest123").and_return(true)

      get :index

      expect(JSON.parse(response.body)["current_guest_token"]).to eq("guest123")
    end
  end
end