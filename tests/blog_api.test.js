import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import Blog from '../models/blog.js'

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))

  const promiseArrayBlogs = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArrayBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Confirm total of blogs in DDBB', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('The ID property must exist', async () => {
  const formatBlogs = await helper.blogsInDb()

  formatBlogs.map(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('A valid blog can be added', async () => {
  const newBlog = {
    title: 'Adding a new blog from testing',
    author: 'Luis Navarro',
    url: 'http://jorgluisnavarro.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsUpdate = await helper.blogsInDb()

  expect(blogsUpdate).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsUpdate.map(blog => blog.title)

  expect(titles).toContain('Adding a new blog from testing')
})

test('If the likes property is not there it should be zero', async () => {
  const newBlog = {
    title: 'Adding a new blog without likes property',
    author: 'Luis Navarro',
    url: 'http://jorgluisnavarro.com',
  }

  const blogCreated = await api
    .post('/api/blogs')
    .send(newBlog)

  expect(blogCreated.body.likes).toBe(0)
})

test('A invalid blog can not be added', async () => {
  const newBlog = {
    author: 'Luis Navarro',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsUpdate = await helper.blogsInDb()

  expect(blogsUpdate).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})