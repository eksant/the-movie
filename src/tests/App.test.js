import { render, screen } from '@testing-library/react'
import App from '../App'

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    }
  }

test('Renders title movie', () => {
  render(<App />)
  const titleElement = screen.getByText(/Popular Movies/i)
  expect(titleElement).toBeInTheDocument()
})
