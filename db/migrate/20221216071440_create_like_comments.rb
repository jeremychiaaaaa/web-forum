class CreateLikeComments < ActiveRecord::Migration[7.0]
  def change
    create_table :like_comments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :comment, null: false, foreign_key: true

      t.timestamps
    end

    # this ensures that the user cannot like a comment more than once 

    add_index :like_comments, [:user_id, :comment_id], unique:true

  end
end
