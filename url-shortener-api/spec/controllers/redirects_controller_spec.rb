require "rails_helper"

RSpec.describe RedirectsController, type: :controller do
  let(:url) do
    instance_double(
      Url,
      long_url: "https://google.com",
      expired?: false,
      cache_ttl: 3600,
      )
  end

  before do
    routes.draw do
      get "/:short_code" => "redirects#show"
    end
  end

  describe "GET #show" do
    it "redirects using cached redis value" do
      allow(REDIS).to receive(:get).with("url:abc123").and_return("https://google.com")
      allow(Url).to receive_message_chain(:where, :inc)

      get :show, params: { short_code: "abc123" }

      expect(response).to redirect_to("https://google.com")
    end

    it "loads from database when cache misses" do
      allow(REDIS).to receive(:get).and_return(nil)
      allow(REDIS).to receive(:setex)

      allow(Url).to receive(:find_by).with(short_code: "abc123").and_return(url)
      allow(Url).to receive_message_chain(:where, :inc)

      get :show, params: { short_code: "abc123" }

      expect(response).to redirect_to("https://google.com")
      expect(REDIS).to have_received(:setex).with("url:abc123", 3600, "https://google.com")
    end

    it "returns not found when url does not exist" do
      allow(REDIS).to receive(:get).and_return(nil)
      allow(Url).to receive(:find_by).and_return(nil)

      get :show, params: { short_code: "missing" }

      expect(response).to have_http_status(:not_found)
    end

    it "returns gone when url is expired" do
      expired_url = instance_double(
        Url,
        expired?: true,
      )

      allow(REDIS).to receive(:get).and_return(nil)
      allow(Url).to receive(:find_by).and_return(expired_url)

      get :show, params: { short_code: "expired" }

      expect(response).to have_http_status(:gone)
    end
  end
end