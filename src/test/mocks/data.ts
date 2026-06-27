import { vi } from 'vitest'
import type { Recipe, RecipeResult } from '../../types/recipe'

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    image: 'https://example.com/pasta.jpg',
    summary: '<p>A classic Italian pasta dish made with eggs and pancetta.</p>',
    extendedIngredients: [
      { id: 1, original: '400g spaghetti' },
      { id: 2, original: '200g pancetta' },
    ],
    analyzedInstructions: [
      { steps: [{ number: 1, step: 'Boil water and cook pasta.' }] },
    ],
  },
  {
    id: 2,
    title: 'Margherita Pizza',
    image: 'https://example.com/pizza.jpg',
    summary: '<p>A classic Neapolitan pizza with tomato and mozzarella.</p>',
    extendedIngredients: [
      { id: 1, original: 'Pizza dough' },
      { id: 2, original: 'Tomato sauce' },
    ],
    analyzedInstructions: [
      { steps: [{ number: 1, step: 'Spread sauce on dough.' }, { number: 2, step: 'Add toppings and bake.' }] },
    ],
  },
]

export const mockRecipeResults: RecipeResult[] = [
  { id: 1, title: 'Spaghetti Carbonara', image: 'https://example.com/pasta.jpg' },
  { id: 2, title: 'Margherita Pizza', image: 'https://example.com/pizza.jpg' },
]

export const mockRecipe: Recipe = mockRecipes[0]

export const createMockFetch = (data: unknown) =>
  vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  } as unknown as Response)
