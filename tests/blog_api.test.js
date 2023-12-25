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



afterAll(() => {
  mongoose.connection.close()
})