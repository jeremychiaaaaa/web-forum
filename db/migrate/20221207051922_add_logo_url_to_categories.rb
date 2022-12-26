class AddLogoUrlToCategories < ActiveRecord::Migration[7.0]
  def change
    add_column :categories, :icon_url, :string
  end
end
