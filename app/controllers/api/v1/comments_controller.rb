module Api 
    module V1 
        class CommentsController < ApplicationController
            
            #ensure that users only can create a comment after logging in, where authenticate is a helper method defined in the application_controller.rb file

            before_action :authenticate, only: [:create,:destroy,:update]

            #create a new comment

            def create
                comment = current_user.comments.new(comment_params)
                if comment.save 
                    render json: CommentSerializer.new(comment).serializable_hash.to_json
                else 
                    render json: {error: comment.errors.messages}, status: 422
                end
            end

            #delete a comment written by a user 

            def destroy
                comment = current_user.comments.find(params[:id])
                if comment.destroy 
                    head :no_content
                else 
                    render json: {error: comment.errors.messages}, status: 422
                end
            end


            #update a post written by a user

            def update 
                comment = current_user.comments.find(params[:id])
                if comment.update(comment_params)
                    render json: CommentSerializer.new(comment).serializable_hash.to_json
                else 
                    render json: {error: comment.errors.messages}, status: 422
                end
            end

            # get all comments to a post 

            def get_related_comments 
                comment = Comment.order(created_at: :desc).where(post_id: params[:post_id])
                render json: CommentSerializer.new(comment).serializable_hash.to_json
            end
            
            # show a specific comment and all replies to that specific comment 

            def get_related_replies 
                comment = Comment.where(parent_id: params[:parent_id])
                render json: CommentSerializer.new(comment).serializable_hash.to_json
            end 

           

            private 
            def comment_params
                params.require(:comment).permit(:content, :post_id, :user_id,:created_at, :parent_id ) 
            end



        end
    end
end