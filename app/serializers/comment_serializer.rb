class CommentSerializer
  include JSONAPI::Serializer
  attributes :content, :post_id, :user_id, :created_at, :parent_id
 
  has_many :like_comments
end
