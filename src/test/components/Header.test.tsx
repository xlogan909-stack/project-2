import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../../components/Header'

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

describe('Header', () => {
  it('renders the brand name', () => {
    renderHeader()
    expect(screen.getByText('All Recipes')).toBeInTheDocument()
  })

  it('renders a link that navigates to home', () => {
    renderHeader()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/')
  })

  it('renders as a header landmark element', () => {
    renderHeader()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

})
