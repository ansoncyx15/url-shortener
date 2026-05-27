require "rails_helper"

RSpec.describe UrlsController, type: :controller do
  let(:user) { instance_double(User) }
  let(:url) do
    instance_double(
      Url,
      id: "1",
      long_url: "https://google.com",
      short_code: "abc123",
      expired?: false,
      expires_at: nil,
      visit_count: 10,
      created_at: Time.current,
      cache_ttl: 3600,
      save: true,
      )
  end

  before do
    routes.draw do
      get "index" => "urls#index"
      post "create" => "urls#create"
    end
  end

  describe "GET #index" do
    it "returns unauthorized without user or guest token" do
      allow(controller).to receive(:current_user).and_return(nil)
      allow(controller).to receive(:current_guest_token).and_return(nil)

      get :index

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns paginated urls for the current user" do
      scope = double
      allow(controller).to receive(:current_user).and_return(user)
      allow(user).to receive(:urls).and_return(scope)
      allow(scope).to receive(:any_of).and_return(scope)
      allow(scope).to receive(:count).and_return(1)
      allow(scope).to receive_message_chain(:order, :skip, :limit).and_return([url])

      get :index

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["data"].length).to eq(1)
      expect(body["data"].first["shortCode"]).to eq("abc123")
      expect(body["pagination"]["total"]).to eq(1)
    end
  end

  describe "POST #create" do
    before do
      allow(controller).to receive(:current_user).and_return(user)
    end

    it "creates a shortened url" do
      allow(ShortCodeGenerator).to receive(:generate).and_return("abc123")

      allow(Url).to receive_message_chain(:where, :exists?).and_return(false)

      allow(Url).to receive(:new).and_return(url)

      allow(REDIS).to receive(:setex)

      post :create, params: {
        long_url: "https://google.com",
      }

      expect(response).to have_http_status(:created)
      expect(REDIS).to have_received(:setex).with("url:abc123", 3600, "https://google.com")
    end

    it "returns validation error when long url is missing" do
      post :create, params: {}

      expect(response).to have_http_status(:unprocessable_entity)

      expect(JSON.parse(response.body)["error"]).to eq("Long url is required!")
    end

    it "returns conflict when alias already exists" do
      allow(Url).to receive_message_chain(:where, :exists?).and_return(true)

      post :create, params: {
        custom_alias: "taken123",
        long_url: "https://google.com",
      }

      expect(response).to have_http_status(:conflict)

      expect(JSON.parse(response.body)["error"]).to include("already taken")
    end
  end
end