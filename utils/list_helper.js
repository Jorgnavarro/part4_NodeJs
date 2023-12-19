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
    //agrupamos los autores por nombre
    const totalBlogsByAuthor = _.countBy(blogs, function(b) {return b.author})
    console.log(totalBlogsByAuthor)
    //obtenemos la cantidad de los blogs agrupados por cada author, y sacamos el mayor
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
    const groupByAuthor = _.groupBy(blogs, function(b) {
        return b.author
    })
    console.log(groupByAuthor)
    let authorLikes = 0
    let result = {}
    //iteramos un objeto que contiene arreglos
    for (const author in groupByAuthor) {
        //por cada arreglo dentro del objeto, sumamos la propiedad likes
        let likesByAuthor = _.sumBy(groupByAuthor[author], "likes") 
        //por cada iteración almacenamos al autor con más likes y eso es lo que retornamos al final
        if(authorLikes<likesByAuthor){
           authorLikes = likesByAuthor
           result = {
            author: author,
            likes: likesByAuthor,
           }
        }
    }
    return result
}

module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}