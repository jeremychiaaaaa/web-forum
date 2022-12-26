
module Api 
    module V1 
        class LikeCommentsController < ApplicationController
            before_action :authenticate
            #before_action :set_post_to_delete, only: [:destroy]
           
            #add a like to a comment

            def create 
           
                    
                like = current_user.like_comments.new(like_params)
                if like.save 
                    render json: LikeCommentSerializer.new(like).serializable_hash.to_json                   
                else 
                    render json: {error: like.errors.messages}, status: 422
                end
            end

            # unlike a post

            def destroy 

                #id passed in will be the id of the like related to the user so no user can delete another user's like

                like = current_user.like_comments.find(params[:id])    
                
                
                if like.destroy 
                   head :no_content
                else 
                    render json: {error: like.errors.messages}, status: 422
                end
            end

            

            
            private 
           

            def like_params
                params.require(:like_comment).permit(:comment_id)
            end

        end
    end
end