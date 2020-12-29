import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders learn react link', () => {
  render(<App />)
  const linkElement = screen.getByText(/Popular Movies/i)
  console.log('==linkElement', linkElement)
  // expect(linkElement).toBeInTheDocument()
})
