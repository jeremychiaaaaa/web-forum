

#some mock data for using insomnia to test out my api routes
categories = Category.create(
    [
        {
            name: "Sports",
            icon_url: "https://cdn-icons-png.flaticon.com/512/33/33736.png"
        },
        {
            name: "Gaming",
            icon_url: "https://cdn-icons-png.flaticon.com/512/686/686589.png"
        },
        {
            name: "TV",
            icon_url: "https://cdn-icons-png.flaticon.com/512/8624/8624184.png"
        },
        {
            name: "Travel",
            icon_url: "https://cdn-icons-png.flaticon.com/512/761/761488.png"
        },
        {
            name: "Health & Fitness",
            icon_url: "https://cdn-icons-png.flaticon.com/512/1719/1719695.png"
        },
        {
            name: "Fashion",
            icon_url: "https://cdn-icons-png.flaticon.com/512/687/687699.png"
        },
    ]
)

posts = Post.create([
    {
        title: "Post 1",
        description: "This is post 1",
        image_url: "",
        category: categories.first
    },
    {
        title: "Post 2",
        description: "This is post 2",
        image_url: "",
        category: categories.second

        
    },
    {
        title: "Post 3",
        description: "This is post 3",
        image_url: "",
        category: categories.third
        
    }
])
   


