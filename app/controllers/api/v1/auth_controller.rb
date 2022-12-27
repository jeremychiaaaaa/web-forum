# authentication / registration process was learnt from https://medium.com/swlh/react-reactions-cfdde7f08dff


module Api 
  module V1 
      class AuthController < ApplicationController

          #this controller is the control flow for the logging in and out of users

          #this method here is called when the user is trying to log in
          def create
              @user = User.find_by(username: session_params[:username])
            
              if @user && @user.authenticate(session_params[:password])
                login!
                render json: UserSerializer.new(@user,options).serializable_hash.to_json
              else
                render json: { 
                  status: 401,
                  errors: ['User does not exist, please try again']
                }
              end
          end



          def logged_in
              if logged_in? && current_user
                render json: UserSerializer.new(current_user,options).serializable_hash.to_json
              else
               
                render json: {error: current_user.errors.messages}, status: 422
          
              end
          end


          def logout 
                logout!
                render json: {
                  status: 200,
                  logged_out: true
                }
          end


          private 
          def session_params 
              params.permit(:username, :password)
          end 

          def options 
            @options ||= {include: [:posts, :likes, :like_comments, :comments]}
          end


      end
  end
end