const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithManyBlogs = [
  {
    _id: '0',
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 5,
    __v: 0
  },
  {
    _id: '1',
    title: 'title1',
    author: 'author1',
    url: 'url1',
    likes: 3,
    __v: 0
  },
  {
    _id: '2',
    title: 'title2',
    author: 'author2',
    url: 'url2',
    likes: 2,
    __v: 0
  },
  {
    _id: '3',
    title: 'title3',
    author: 'author3',
    url: 'url3',
    likes: 6,
    __v: 0
  }
]

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(16)
  })
})

describe('favorite blog', () => {
  test('of an empty list is an empty object', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test('of a list with one blog is that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    delete result['__v']
    delete result['_id']
    delete result['url']
    expect(result).toEqual(
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      })
  })

  test('of a list with many blogs is the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    delete result['__v']
    delete result['_id']
    delete result['url']
    expect(result).toEqual(
      {
        title: 'title3',
        author: 'author3',
        likes: 6
      })
  })
})