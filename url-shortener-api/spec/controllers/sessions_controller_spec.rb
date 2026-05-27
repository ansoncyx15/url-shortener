require "rails_helper"

RSpec.describe SessionsController, type: :controller do
  before do
    routes.draw do
      post "signup" => "sessions#signup"
      post "login" => "sessions#login"
      post "guest" => "sessions#guest"
    end
  end

  describe "POST #signup" do
    let(:user) do
      instance_double(
        User,
        save: true,
        issue_token!: "tok_test_abc123",
        email: "test@example.com",
        )
    end

    it "creates a new user account" do
      allow(User).to receive(:new).and_return(user)

      post :signup, params: {
        email: "test@example.com",
        password: "password123",
      }

      expect(response).to have_http_status(:created)

      body = JSON.parse(response.body)

      expect(body["token"]).to eq("tok_test_abc123")
      expect(body["email"]).to eq("test@example.com")
    end
  end

  describe "POST #login" do
    let(:user) do
      instance_double(
        User,
        authenticate: true,
        issue_token!: "tok_test_abc123",
        email: "test@example.com",
        )
    end

    it "logs in valid user" do
      allow(User).to receive(:find_by).with(email: "test@example.com").and_return(user)

      post :login, params: {
        email: "test@example.com",
        password: "password123",
      }

      expect(response).to have_http_status(:ok)
    end

    it "returns unauthorized for invalid credentials" do
      allow(User).to receive(:find_by).and_return(nil)

      post :login, params: {
        email: "wrong@example.com",
        password: "wrongpassword",
      }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)["error"]).to eq("Email or password invalid!")
    end
  end

  describe "POST #guest" do
    it "creates guest token" do
      allow(SecureRandom).to receive(:urlsafe_base64).and_return("guest-token")
      allow(REDIS).to receive(:setex)

      post :guest

      expect(response).to have_http_status(:created)
      expect(REDIS).to have_received(:setex).with("guest:guest-token", 1.day.to_i, "1")
    end
  end
end