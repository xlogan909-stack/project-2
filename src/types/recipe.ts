export interface Recipe {
  id: number
  title: string
  image: string
  summary: string
  extendedIngredients: Ingredient[]
  analyzedInstructions: AnalyzedInstruction[]
}

export interface Ingredient {
  id: number
  original: string
}

export interface AnalyzedInstruction {
  steps: Step[]
}

export interface Step {
  number: number
  step: string
}

export interface RecipeResult {
  id: number
  title: string
  image: string
}

export interface SearchResults {
  results: RecipeResult[]
}

export interface RandomResults {
  recipes: Recipe[]
}
