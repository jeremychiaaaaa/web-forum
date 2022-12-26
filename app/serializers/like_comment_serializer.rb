class LikeCommentSerializer
  include JSONAPI::Serializer
  attributes :comment_id, :user_id
  belongs_to :user
end
