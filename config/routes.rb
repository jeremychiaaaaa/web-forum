Rails.application.routes.draw do
  root "pages#index"

  namespace :api do 
    namespace :v1 do 
      resources :categories, param: :slug
      resources :posts do
        collection do
          get 'category/:category_name', to: 'posts#get_related_posts'
          get'/:post_id/:slug', to:'posts#show'
        end
      end
      
      
      resources :comments do 
        collection do 
          get '/:post_id', to: 'comments#get_related_comments'
          get '/replies/:parent_id', to: 'comments#get_related_replies'
        end
      end

      resources :like_comments, only: [:create, :destroy] 
        
      resources :likes, only: [:create, :destroy]
      resources :auth, only: %i[create] do
        collection do
          get '/logged_in', to: 'auth#logged_in'
          post 'logout', to: 'auth#logout'
          post 'login', to:'auth#create'
        end
      end
      resources :users, only: [:create, :show, :index] 
    end
  end
  #catch any path that does not meet pre-defined
  get '*path', to: 'pages#index', constraints: lambda { |req|
  req.path.exclude? 'rails/active_storage'
}
end
