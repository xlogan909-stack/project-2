import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Searched from '../../pages/Searched'
import { mockRecipeResults, createMockFetch } from '../mocks/data'

const renderWithQuery = (query: string) =>
  render(
    <MemoryRouter initialEntries={[`/searched/${query}`]}>
      <Routes>
        <Route path="/searched/:search" element={<Searched />} />
      </Routes>
    </MemoryRouter>
  )

describe('Searched', () => {
  it('shows skeleton while data is loading', () => {
    vi.stubGlobal('fetch', createMockFetch({ results: mockRecipeResults }))
    renderWithQuery('pasta')
    expect(screen.queryByText(mockRecipeResults[0].title)).not.toBeInTheDocument()
  })

  it('renders recipe cards after data loads', async () => {
    vi.stubGlobal('fetch', createMockFetch({ results: mockRecipeResults }))
    renderWithQuery('pasta')
    await waitFor(() => {
      expect(screen.getByText(mockRecipeResults[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockRecipeResults[1].title)).toBeInTheDocument()
    })
  })

  it('calls the API with the correct search query from the URL', async () => {
    const fetchMock = createMockFetch({ results: mockRecipeResults })
    vi.stubGlobal('fetch', fetchMock)
    renderWithQuery('chicken')
    await waitFor(() => {
      expect(screen.getByText(mockRecipeResults[0].title)).toBeInTheDocument()
    })
    const calledUrl = fetchMock.mock.calls[0][0] as string
    expect(calledUrl).toContain('query=chicken')
  })

  it('renders images with accessible alt text', async () => {
    vi.stubGlobal('fetch', createMockFetch({ results: mockRecipeResults }))
    renderWithQuery('pasta')
    await waitFor(() => {
      expect(screen.getByAltText(mockRecipeResults[0].title)).toBeInTheDocument()
    })
  })

  it('renders recipe links pointing to the detail page', async () => {
    vi.stubGlobal('fetch', createMockFetch({ results: mockRecipeResults }))
    renderWithQuery('pasta')
    await waitFor(() => {
      const links = screen.getAllByRole('link')
      const hrefs = links.map((l) => l.getAttribute('href'))
      expect(hrefs).toContain(`/searched/pasta/recipe/${mockRecipeResults[0].id}`)
    })
  })

  it('keeps showing skeleton when search returns no results', async () => {
    vi.stubGlobal('fetch', createMockFetch({ results: [] }))
    renderWithQuery('xyzabc')
    await waitFor(() => {
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })
})
