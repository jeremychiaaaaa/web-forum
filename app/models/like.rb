class Like < ApplicationRecord
 
  #ensure model level validation that a user can only like a post once

  validates :user_id, uniqueness: {scope: :post_id}
  belongs_to :user
  belongs_to :post
end
