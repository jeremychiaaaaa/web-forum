module Api 
    module V1 
        class PostsController < ApplicationController
        
          #ensure that users only can create a post after logging in, where authenticate is a helper method defined in the application_controller.rb file

         


          # get all posts
          def index 
            
            #since default category is the latest category, sort the posts by the created_at timestamp

            posts = Post.order(created_at: :desc)



            render json: PostSerializer.new(posts,options).serializable_hash.to_json
          end

          #sort posts by popularity (ie number of likes on the post)

        

          #get a specific post based on the title (slugged value) in the url

          def show 
            post = Post.find_by(slug: params[:slug])
            render json: PostSerializer.new(post,options).serializable_hash.to_json
          end



          # create a new post
          def create 
            post = current_user.posts.new(post_params)
            if post.save 
                render json: PostSerializer.new(post,options).serializable_hash.to_json
            else 
                render json: {error: post.errors.messages}, status: 422
            end
          end
          
          # update a post written by a user

          def update 
            post = current_user.posts.find(params[:id])
            if post.update(post_params)
                render json: PostSerializer.new(post,options).serializable_hash.to_json
            else 
                render json: {error: post.errors.messages}, status: 422
            end
          end

          #delete a post written by a user
          def destroy 
            post = current_user.posts.find(params[:id])
            if post.destroy 
               head :no_content
            else 
                render json: {error: post.errors.messages}, status: 422
            end
          end


          #get posts related to a category

          def get_related_posts 
          
            post = Post.order(created_at: :desc).where(category_name: params[:category_name])
           
            render json: PostSerializer.new(post,options).serializable_hash.to_json
          end

          #private method for the params to create a new post

          private 
          def post_params 
            params.require(:post).permit(:title, :description,:image,:category_id,:category_name,:username)
          end

          def options 
            @options ||= {include: [:comments, :likes, :user ]}
          end


        end
    end
end