import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Recipe from '../../pages/Recipe'
import { mockRecipe, createMockFetch } from '../mocks/data'

const renderWithId = (id: number) =>
  render(
    <MemoryRouter initialEntries={[`/recipe/${id}`]}>
      <Routes>
        <Route path="/recipe/:name" element={<Recipe />} />
      </Routes>
    </MemoryRouter>
  )

describe('Recipe', () => {
  it('does not show recipe title while loading', () => {
    vi.stubGlobal('fetch', createMockFetch(mockRecipe))
    renderWithId(mockRecipe.id)
    expect(screen.queryByText(mockRecipe.title)).not.toBeInTheDocument()
  })

  it('renders the recipe title after data loads', async () => {
    vi.stubGlobal('fetch', createMockFetch(mockRecipe))
    renderWithId(mockRecipe.id)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: mockRecipe.title })).toBeInTheDocument()
    })
  })

  it('renders the recipe image with correct src', async () => {
    vi.stubGlobal('fetch', createMockFetch(mockRecipe))
    renderWithId(mockRecipe.id)
    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute('src', mockRecipe.image)
    })
  })

  it('calls the API with the recipe ID from the URL', async () => {
    const fetchMock = createMockFetch(mockRecipe)
    vi.stubGlobal('fetch', fetchMock)
    renderWithId(mockRecipe.id)
    await waitFor(() => {
      expect(screen.getByText(mockRecipe.title)).toBeInTheDocument()
    })
    const calledUrl = fetchMock.mock.calls[0][0] as string
    expect(calledUrl).toContain(`/recipes/${mockRecipe.id}/information`)
  })

  it('shows Summary tab content by default', async () => {
    vi.stubGlobal('fetch', createMockFetch(mockRecipe))
    renderWithId(mockRecipe.id)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    })
  })

  it('displays rendered summary HTML content', async () => {
    vi.stubGlobal('fetch', createMockFetch(mockRecipe))
    renderWithId(mockRecipe.id)
    await waitFor(() => {
      expect(screen.getByText(/classic Italian pasta dish/i)).toBeInTheDocument()
    })
  })

  it('switches to Ingredients tab and shows all ingredients', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', createMockFetch(mockRecipe))
    renderWithId(mockRecipe.id)
    await waitFor(() => screen.getByText('Ingredients'))
    await user.click(screen.getByText('Ingredients'))
    expect(screen.getByRole('heading', { name: 'Ingredients' })).toBeInTheDocument()
    mockRecipe.extendedIngredients.forEach((ingredient) => {
      expect(screen.getByText(ingredient.original)).toBeInTheDocument()
    })
  })

  it('switches to Steps tab and shows all steps', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', createMockFetch(mockRecipe))
    renderWithId(mockRecipe.id)
    await waitFor(() => screen.getByText('Steps'))
    await user.click(screen.getByText('Steps'))
    expect(screen.getByRole('heading', { name: 'Steps' })).toBeInTheDocument()
    mockRecipe.analyzedInstructions[0].steps.forEach((step) => {
      expect(screen.getByText(`Step ${step.number}`)).toBeInTheDocument()
      expect(screen.getByText(step.step)).toBeInTheDocument()
    })
  })

  it('shows fallback message when recipe has no step instructions', async () => {
    const user = userEvent.setup()
    const noStepsRecipe = { ...mockRecipe, analyzedInstructions: [] }
    vi.stubGlobal('fetch', createMockFetch(noStepsRecipe))
    renderWithId(noStepsRecipe.id)
    await waitFor(() => screen.getByText('Steps'))
    await user.click(screen.getByText('Steps'))
    expect(screen.getByText('No step data available')).toBeInTheDocument()
  })

  it('renders three tab buttons (Summary, Ingredients, Steps)', async () => {
    vi.stubGlobal('fetch', createMockFetch(mockRecipe))
    renderWithId(mockRecipe.id)
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const labels = buttons.map((b) => b.textContent)
      expect(labels).toContain('Summary')
      expect(labels).toContain('Ingredients')
      expect(labels).toContain('Steps')
    })
  })
})
