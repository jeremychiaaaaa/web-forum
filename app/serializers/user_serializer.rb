class UserSerializer
  include JSONAPI::Serializer
  attributes :username, :profile_url

  has_many :posts
  has_many :comments
  has_many :like_comments
  has_many :likes
end
