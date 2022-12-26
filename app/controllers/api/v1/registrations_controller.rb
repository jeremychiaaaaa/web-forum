module Api 
    module V1 
        class RegistrationsController < ApplicationController

            #get all the users registered   

            def index
                @users = User.all
                if @users
                render json: UserSerializer.new(@users).serializable_hash.to_json
                else
                render json:
                {
                  status: 500,
                errors: ['no users found']
                }
                end
            end

            # create a new user

            def create
                @user = User.new(user_params)
                if @user.save
                login!  
                render json: UserSerializer.new(@user,options).serializable_hash.to_json
                else 
                render json: 
                {
                status: 500,
                errors: @user.errors.full_messages
                }
                end
            end

            #get a specific user based on his user_id
            
            def show
                @user = User.find(params[:id])
                if @user
                render json: UserSerializer.new(@user,options).serializable_hash.to_json
                else
                render json: 
                {
                status: 500,
                errors: ['user not found']
                }
                end
            end

            private 
            def user_params
                params.require(:user).permit(:username, :email, :password, :profile_pic)
            end
            
            def options 
                @options ||= {include: [:posts, :likes, :like_comments, :comments]}
            end
    

        end
    end
end
