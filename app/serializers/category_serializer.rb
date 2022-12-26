class CategorySerializer
  include JSONAPI::Serializer
  attributes :name, :slug, :icon_url

  has_many :posts
end
