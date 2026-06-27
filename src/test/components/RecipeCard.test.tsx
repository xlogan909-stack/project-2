import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecipeCard from '../../components/RecipeCard'
import { mockRecipeResults } from '../mocks/data'

const data = mockRecipeResults[0]

const renderCard = () =>
  render(
    <MemoryRouter>
      <RecipeCard data={data} />
    </MemoryRouter>
  )

describe('RecipeCard', () => {
  it('renders the recipe title', () => {
    renderCard()
    expect(screen.getByText(data.title)).toBeInTheDocument()
  })

  it('renders the recipe image with correct src', () => {
    renderCard()
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', data.image)
  })

  it('renders the image with accessible alt text', () => {
    renderCard()
    expect(screen.getByAltText(data.title)).toBeInTheDocument()
  })

  it('links to the correct recipe detail page', () => {
    renderCard()
    expect(screen.getByRole('link')).toHaveAttribute('href', `/recipe/${data.id}`)
  })
})
