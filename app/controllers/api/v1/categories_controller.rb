
module Api 
    module V1 
        class CategoriesController < ApplicationController
            # get all the categories available
          def index 
            categories = Category.all

            #using the serializable_hash.to_json method of the jsonapi-serializer gem

            render json: CategorySerializer.new(categories,options).serializable_hash.to_json
          end
         
          #get specific category

          def show 
            category = Category.find_by!(slug: params[:slug])
               
            render json: CategorySerializer.new(category,options).serializable_hash.to_json
          end



 

          #to include the posts associated with the categories

          def options 
            @options ||= {include: %i[posts]}
          end
         



        end
    end
end