class PostSerializer
  include JSONAPI::Serializer
  attributes :title, :description, :slug,:category_name, :created_at, :username, :image_url, :category_id

  belongs_to :user
  has_many :comments
  has_many :likes
end
