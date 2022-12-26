class DropLikeComments < ActiveRecord::Migration[7.0]
  def change
    drop_table :like_comments
  end
end
