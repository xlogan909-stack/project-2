import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Cuisine from '../../pages/Cuisine'
import { mockRecipeResults, createMockFetch } from '../mocks/data'

const renderWithRoute = (cuisineType: string) =>
  render(
    <MemoryRouter initialEntries={[`/cuisine/${cuisineType}`]}>
      <Routes>
        <Route path="/cuisine/:type" element={<Cuisine />} />
      </Routes>
    </MemoryRouter>
  )

describe('Cuisine', () => {
  it('renders skeleton cards while data is loading', () => {
    vi.stubGlobal('fetch', createMockFetch({ results: mockRecipeResults }))
    renderWithRoute('Italian')
    expect(screen.queryByText(mockRecipeResults[0].title)).not.toBeInTheDocument()
  })

  it('renders recipe cards after data loads', async () => {
    vi.stubGlobal('fetch', createMockFetch({ results: mockRecipeResults }))
    renderWithRoute('Italian')
    await waitFor(() => {
      expect(screen.getByText(mockRecipeResults[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockRecipeResults[1].title)).toBeInTheDocument()
    })
  })

  it('calls the API with the correct cuisine type from the URL', async () => {
    const fetchMock = createMockFetch({ results: mockRecipeResults })
    vi.stubGlobal('fetch', fetchMock)
    renderWithRoute('Thai')
    await waitFor(() => {
      expect(screen.getByText(mockRecipeResults[0].title)).toBeInTheDocument()
    })
    const calledUrl = fetchMock.mock.calls[0][0] as string
    expect(calledUrl).toContain('cuisine=Thai')
  })

  it('renders images with accessible alt text', async () => {
    vi.stubGlobal('fetch', createMockFetch({ results: mockRecipeResults }))
    renderWithRoute('Italian')
    await waitFor(() => {
      expect(screen.getByAltText(mockRecipeResults[0].title)).toBeInTheDocument()
    })
  })

  it('renders recipe links pointing to the detail page', async () => {
    vi.stubGlobal('fetch', createMockFetch({ results: mockRecipeResults }))
    renderWithRoute('Italian')
    await waitFor(() => {
      const links = screen.getAllByRole('link')
      const hrefs = links.map((l) => l.getAttribute('href'))
      expect(hrefs).toContain(`/cuisine/Italian/recipe/${mockRecipeResults[0].id}`)
    })
  })

  it('shows skeleton when API returns empty results', async () => {
    vi.stubGlobal('fetch', createMockFetch({ results: [] }))
    renderWithRoute('Italian')
    await waitFor(() => {
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })
})
