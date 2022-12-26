
module Api 
    module V1 
        class LikesController < ApplicationController
            before_action :authenticate
            #before_action :set_post_to_delete, only: [:destroy]
           
            #add a like to a post

            def create 
           
                    
                like = current_user.likes.new(like_params)
                if like.save 
                    render json: LikeSerializer.new(like).serializable_hash.to_json                   
                else 
                    render json: {error: like.errors.messages}, status: 422
                end
            end

            # unlike a post

            def destroy 

                #id passed in will be the id of the like related to the user so no user can delete another user's like

                like = current_user.likes.find(params[:id])    
                
                #like = post.likes.find(params[:])
                if like.destroy 
                   head :no_content
                else 
                    render json: {error: like.errors.messages}, status: 422
                end
            end

            

            
            private 
           

            def like_params
                params.require(:like).permit(:post_id)
            end

        end
    end
end