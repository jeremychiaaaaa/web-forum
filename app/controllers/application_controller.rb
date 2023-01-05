class ApplicationController < ActionController::Base
    #this are some of the standard helper methods that i will use for the auth and registration controllers 


    skip_before_action :verify_authenticity_token
    helper_method :login!, :logged_in?, :current_user, :authorized_user?, :logout!, :set_user, :authenticate
    before_action :current_user
      def login!
        session[:user_id] = @user.id
      end
      def logged_in?
        !!session[:user_id]
      end
      def current_user
        @current_user ||= User.find(session[:user_id]) if session[:user_id]
      end
      def authorized_user?
         @user == current_user
      end
      def logout!
         session.clear
      end
      def set_user
      @user = User.find_by(id: session[:user_id])
      end
      def authenticate
        render json: { error: 'Access Denied' }, status: 401 unless current_user
      end

end
