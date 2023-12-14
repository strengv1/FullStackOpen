import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('blog renders title and author by default, but not url or likes', () => {
  const blog = {
    title: 'Otsikko',
    author: 'author',
    url: 'url',
    likes: 1,
    user: '74ca0b8a065369d6027581ea',
  }
  const dummyUser = {
    username: 'username',
    name: 'Nimi',
    blogs: {},
    id: '74ca0b8a065369d6027581ea',
  }
  const mockHandler1 = jest.fn()
  const mockHandler2 = jest.fn()
  const mockHandler3 = jest.fn()
  const functions = [mockHandler1, mockHandler2, mockHandler3]

  render(
    <Blog
      key={0}
      user={dummyUser}
      blog={blog}
      index={0}
      showInfo={false}
      functions={functions}
    />,
  )

  const titleElement = screen.getByText('Otsikko author')
  expect(titleElement).toBeDefined()
  const urlElement = screen.queryByText('url')
  expect(urlElement).toBeNull()
  const likeElement = screen.queryByText('likes')
  expect(likeElement).toBeNull()
})

test('blog also renders url, likes and user when view has been clicked', () => {
  const blog = {
    title: 'Otsikko',
    author: 'author',
    url: 'url',
    likes: 1,
    user: '74ca0b8a065369d6027581ea',
  }
  const dummyUser = {
    username: 'username',
    name: 'Nimi',
    blogs: {},
    id: '74ca0b8a065369d6027581ea',
  }
  const mockHandler1 = jest.fn()
  const mockHandler2 = jest.fn()
  const mockHandler3 = jest.fn()
  const functions = [mockHandler1, mockHandler2, mockHandler3]

  render(
    <Blog
      key={0}
      user={dummyUser}
      blog={blog}
      index={0}
      showInfo={true} //true:view has been clicked
      functions={functions}
    />,
  )

  const titleElement = screen.getByText('Otsikko author')
  expect(titleElement).toBeDefined()
  const urlElement = screen.queryByText('url')
  expect(urlElement).toBeDefined()
  const likeElement = screen.queryByText('likes')
  expect(likeElement).toBeDefined()
  const userElement = screen.queryByText('Nimi')
  expect(userElement).toBeDefined()
})

test('like can be clicked, ', async () => {
  const blog = {
    title: 'Otsikko',
    author: 'author',
    url: 'url',
    likes: 1,
    user: '74ca0b8a065369d6027581ea',
  }
  const dummyUser = {
    username: 'username',
    name: 'Nimi',
    blogs: {},
    id: '74ca0b8a065369d6027581ea',
  }
  const handleViewClick = jest.fn()
  const handleLikeClick = jest.fn()
  const removeBlog = jest.fn()
  const functions = [handleViewClick, handleLikeClick, removeBlog]

  render(
    <Blog
      key={0}
      user={dummyUser}
      blog={blog}
      index={0}
      showInfo={true} //true:view has been clicked
      functions={functions}
    />,
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(handleLikeClick.mock.calls).toHaveLength(2)
})
