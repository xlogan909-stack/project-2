import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Search from '../../components/Search'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

const renderSearch = () =>
  render(
    <MemoryRouter>
      <Search />
    </MemoryRouter>
  )

describe('Search', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders the search input field', () => {
    renderSearch()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders placeholder text', () => {
    renderSearch()
    expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument()
  })

  it('updates the input value as user types', async () => {
    const user = userEvent.setup()
    renderSearch()
    const input = screen.getByRole('textbox')
    await user.type(input, 'pasta')
    expect(input).toHaveValue('pasta')
  })

  it('navigates to search results page on form submit', async () => {
    const user = userEvent.setup()
    renderSearch()
    await user.type(screen.getByRole('textbox'), 'pasta')
    await user.keyboard('{Enter}')
    expect(mockNavigate).toHaveBeenCalledWith('/searched/pasta')
  })

  it('does not navigate when search input is empty', async () => {
    const user = userEvent.setup()
    renderSearch()
    await user.keyboard('{Enter}')
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('trims whitespace from the search query before navigating', async () => {
    const user = userEvent.setup()
    renderSearch()
    await user.type(screen.getByRole('textbox'), '  pizza  ')
    await user.keyboard('{Enter}')
    expect(mockNavigate).toHaveBeenCalledWith('/searched/pizza')
  })

  it('does not navigate for whitespace-only input', async () => {
    const user = userEvent.setup()
    renderSearch()
    await user.type(screen.getByRole('textbox'), '   ')
    await user.keyboard('{Enter}')
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
