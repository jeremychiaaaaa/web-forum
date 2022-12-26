class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user
  belongs_to :parent, class_name: 'Comment', optional: true
  has_many :like_comments, dependent: :destroy
  has_many :replies,class_name:'Comment', foreign_key: :parent_id, dependent: :destroy
end
