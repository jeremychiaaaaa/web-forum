class User < ApplicationRecord
    has_secure_password
    has_many :posts
    has_many :comments
    has_many :likes
    has_many :like_comments
    has_one_attached :profile_pic
    #validation requirements for logging in / signing up


    validates :username, presence: true
    validates :username, uniqueness: true
    validates :username, length: { minimum: 4 }


    def profile_url
        Rails.application.routes.url_helpers.url_for(profile_pic) if profile_pic.attached?
    end 

end
