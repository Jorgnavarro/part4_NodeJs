const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0
    blogs.map(blog => {
        likes += blog.likes
    })
    return likes
}

const favoriteBlog = (blogs) => {
    let blogFavorite = 0
    let newObjet = {}
    blogs.map(blog => {
        if(blogFavorite < blog.likes){
            blogFavorite = blog.likes
        }
    })

    if(blogFavorite != 0){
        return blogs.find(blog => ({
            title: blog.title,
            author: blog.author,
            likes: blog.likes
        }))
        
    }

}

module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
}