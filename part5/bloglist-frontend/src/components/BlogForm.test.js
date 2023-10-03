import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()
  const showNotification = jest.fn()

  render(<BlogForm createBlog={createBlog} showNotification={showNotification} />)

  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')

  await user.type(inputs[0], 'uusi otsikko')
  await user.type(inputs[1], 'uusi author')
  await user.type(inputs[2], 'uusi url')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('uusi otsikko')
  expect(createBlog.mock.calls[0][0].author).toBe('uusi author')
  expect(createBlog.mock.calls[0][0].url).toBe('uusi url')
})