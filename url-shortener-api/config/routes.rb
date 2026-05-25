Rails.application.routes.draw do
  scope :api do
    post "auth/signup", to: "sessions#signup"
    post "auth/login",  to: "sessions#login"
    post "auth/guest",  to: "sessions#guest"

    # Active links log + create (shorten).
    resources :urls, only: %i[index create]
  end

  # Public redirect: GET /<short_code> -> original long URL.
  # Declared last so it doesn't shadow the /api routes above.
  # Set constraints to prevent url having other symbols to prevent short code injection
  get "/:short_code", to: "redirects#show", constraints: { short_code: %r{[A-Za-z0-9_-]+} }
end