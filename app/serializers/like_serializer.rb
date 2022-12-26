class LikeSerializer
  include JSONAPI::Serializer
  attributes :post_id, :user_id

  belongs_to :user
  belongs_to :post
end
