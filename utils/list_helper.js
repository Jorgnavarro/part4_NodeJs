const _ = require('lodash');

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
    //sacamos el mayor numero de likes
    blogs.map(blog => {
        if(blogFavorite < blog.likes){
            blogFavorite = blog.likes
        }
    })

    // buscamos el primer objeto que tenga ese número de likes
    const findFavorite = blogs.find(blog => {
        if(blog.likes === blogFavorite){
            return blog
        }
    })
    //formateamos el objeto como pide el ejercicio y lo retornamos
    return newObjet = {
        title: findFavorite.title,
        author: findFavorite.author,
        likes: findFavorite.likes
    }
    

}

const mostBlogs = (blogs) => {
    //agrupamos los autores y el número de blogs
    const totalBlogsByAuthor = _.countBy(blogs, function(b) {return b.author})
    console.log(totalBlogsByAuthor)
    //obtenemos la cantidad de los blogs agrupados, y sacamos el mayor
    const counterBlogs = _.max(_.valuesIn(totalBlogsByAuthor))
    console.log(counterBlogs)
    let result = {}

    for(const [key, value] of Object.entries(totalBlogsByAuthor)){
        if(counterBlogs === value){
            result = {
                author: key,
                blogs: value
            }
        }
    }
    return result
}

const mostLikes = (blogs) => {
    const totalLikes = _.sumBy(blogs, "likes")
    const groupByAuthor = _.groupBy(blogs, function(b) {
        return b.author
    })
    console.log(totalLikes)
    console.log(groupByAuthor)
    _.forEach(groupByAuthor, function(value, key){
        let likes = _.sumBy(value, "likes")
        console.log(likes)
        //console.log(key[value])
    })
}

module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}