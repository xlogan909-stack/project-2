import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Category from '../../components/Category'

const renderCategory = () =>
  render(
    <MemoryRouter>
      <Category />
    </MemoryRouter>
  )

describe('Category', () => {
  it('renders all four cuisine categories', () => {
    renderCategory()
    expect(screen.getByText('Italian')).toBeInTheDocument()
    expect(screen.getByText('American')).toBeInTheDocument()
    expect(screen.getByText('Thai')).toBeInTheDocument()
    expect(screen.getByText('Chinese')).toBeInTheDocument()
  })

  it('renders exactly four category links', () => {
    renderCategory()
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })

  it('Italian link points to correct route', () => {
    renderCategory()
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/cuisine/Italian')
    expect(hrefs).toContain('/cuisine/American')
    expect(hrefs).toContain('/cuisine/Thai')
    expect(hrefs).toContain('/cuisine/Chinese')
  })

  it('renders as a navigation landmark', () => {
    renderCategory()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
