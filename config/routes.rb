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

      resources :likes, only: [:create, :destroy]
      resources :like_comments, only: [:create, :destroy]
      resources :sessions, only: %i[create] do
        collection do
          get '/logged_in', to: 'sessions#logged_in'
          post 'logout', to: 'sessions#logout'
          post 'login', to:'sessions#create'
        end
      end
      resources :users, only: [:create, :show, :index] 
    end
  end
  #catch any path that does not meet pre-defined

  match "*path", to: "pages#index", via: :all, constraints: lambda { |request| !request.path_parameters[:path].start_with?('rails/') }
end
