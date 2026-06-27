import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Veggie from '../../components/Veggie'
import { mockRecipes, createMockFetch } from '../mocks/data'

vi.mock('@splidejs/react-splide', () => ({
  Splide: ({ children }: { children: React.ReactNode }) => <div data-testid="splide">{children}</div>,
  SplideSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="splide-slide">{children}</div>,
}))

const renderVeggie = () =>
  render(
    <MemoryRouter>
      <Veggie />
    </MemoryRouter>
  )

describe('Veggie', () => {
  it('does not show heading while data is loading', () => {
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderVeggie()
    expect(screen.queryByRole('heading', { name: /veggie picks/i })).not.toBeInTheDocument()
  })

  it('displays "Veggie Picks" heading after data loads', async () => {
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderVeggie()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Veggie Picks' })).toBeInTheDocument()
    })
  })

  it('renders a card for each fetched recipe', async () => {
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderVeggie()
    await waitFor(() => {
      expect(screen.getByText(mockRecipes[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockRecipes[1].title)).toBeInTheDocument()
    })
  })

  it('uses valid localStorage cache and skips the API call', async () => {
    localStorage.setItem('veggie', JSON.stringify(mockRecipes))
    const fetchMock = createMockFetch({ recipes: [] })
    vi.stubGlobal('fetch', fetchMock)
    renderVeggie()
    await waitFor(() => {
      expect(screen.getByText(mockRecipes[0].title)).toBeInTheDocument()
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('stores fetched recipes in localStorage for caching', async () => {
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderVeggie()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Veggie Picks' })).toBeInTheDocument()
    })
    const cached = localStorage.getItem('veggie')
    expect(cached).not.toBeNull()
    expect(JSON.parse(cached!)).toEqual(mockRecipes)
  })

  it('clears corrupted cache and fetches fresh data', async () => {
    localStorage.setItem('veggie', 'corrupted-json{{{')
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderVeggie()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Veggie Picks' })).toBeInTheDocument()
    })
  })

  it('calls the API with vegetarian tag filter', async () => {
    const fetchMock = createMockFetch({ recipes: mockRecipes })
    vi.stubGlobal('fetch', fetchMock)
    renderVeggie()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Veggie Picks' })).toBeInTheDocument()
    })
    const calledUrl = (fetchMock.mock.calls[0][0] as string)
    expect(calledUrl).toContain('tags=vegetarian')
  })
})
