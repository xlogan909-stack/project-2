import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Popular from '../../components/Popular'
import { mockRecipes, createMockFetch } from '../mocks/data'

vi.mock('@splidejs/react-splide', () => ({
  Splide: ({ children }: { children: React.ReactNode }) => <div data-testid="splide">{children}</div>,
  SplideSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="splide-slide">{children}</div>,
}))

const renderPopular = () =>
  render(
    <MemoryRouter>
      <Popular />
    </MemoryRouter>
  )

describe('Popular', () => {
  it('does not show heading while data is loading', () => {
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderPopular()
    expect(screen.queryByRole('heading', { name: /popular/i })).not.toBeInTheDocument()
  })

  it('displays "Popular" heading after data loads', async () => {
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderPopular()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Popular' })).toBeInTheDocument()
    })
  })

  it('renders a card for each fetched recipe', async () => {
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderPopular()
    await waitFor(() => {
      expect(screen.getByText(mockRecipes[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockRecipes[1].title)).toBeInTheDocument()
    })
  })

  it('uses valid localStorage cache and skips the API call', async () => {
    localStorage.setItem('popular', JSON.stringify(mockRecipes))
    const fetchMock = createMockFetch({ recipes: [] })
    vi.stubGlobal('fetch', fetchMock)
    renderPopular()
    await waitFor(() => {
      expect(screen.getByText(mockRecipes[0].title)).toBeInTheDocument()
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('stores fetched recipes in localStorage for caching', async () => {
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderPopular()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Popular' })).toBeInTheDocument()
    })
    const cached = localStorage.getItem('popular')
    expect(cached).not.toBeNull()
    expect(JSON.parse(cached!)).toEqual(mockRecipes)
  })

  it('clears corrupted cache and fetches fresh data', async () => {
    localStorage.setItem('popular', 'corrupted-json{{{')
    vi.stubGlobal('fetch', createMockFetch({ recipes: mockRecipes }))
    renderPopular()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Popular' })).toBeInTheDocument()
    })
  })

  it('does not store data when API response contains no recipes', async () => {
    vi.stubGlobal('fetch', createMockFetch({ recipes: undefined }))
    renderPopular()
    await waitFor(() => {
      expect(localStorage.getItem('popular')).toBeNull()
    })
  })

  it('calls the Spoonacular random recipes endpoint', async () => {
    const fetchMock = createMockFetch({ recipes: mockRecipes })
    vi.stubGlobal('fetch', fetchMock)
    renderPopular()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Popular' })).toBeInTheDocument()
    })
    const calledUrl = (fetchMock.mock.calls[0][0] as string)
    expect(calledUrl).toContain('/recipes/random')
    expect(calledUrl).toContain('number=10')
  })
})
