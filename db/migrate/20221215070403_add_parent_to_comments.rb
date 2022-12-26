class AddParentToComments < ActiveRecord::Migration[7.0]
  def change

    #adds a reference to each comment to support nested commenting
    # the parent_id can be null if the comment is a top level comment

    add_column :comments, :parent_id, :integer, null: true
  end
end
