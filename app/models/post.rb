class Post < ApplicationRecord
    belongs_to :user
    belongs_to :category
    has_many :comments, dependent: :destroy
    has_many :likes, dependent: :destroy #this ensures that when a post is deleted, all likes to that post will be deleted
    #before creating in database call this slugify function 
    #take the title of the post and slugify it to be used as the slug value for the url
    before_create :slugify

    # active storage adapted from this tutorial here https://www.youtube.com/watch?v=_rLMRd676-I&ab_channel=Deanin
    has_one_attached :image

    def slugify
        self.slug = title.parameterize 
    end

    def image_url
        Rails.application.routes.url_helpers.url_for(image) if image.attached?
    end 



end
