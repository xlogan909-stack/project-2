import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import type { RecipeResult } from '../types/recipe'
import RecipeCard from '../components/RecipeCard'
import './Searched.css'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY as string

const Searched = () => {
  const [recipes, setRecipes] = useState<RecipeResult[]>([])
  const { search } = useParams<{ search: string }>()

  useEffect(() => {
    const getSearched = async () => {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${search}`
      )
      const data = await res.json()
      setRecipes(data.results ?? [])
    }
    getSearched()
  }, [search])

  if (recipes.length === 0) {
    return (
      <div className="cuisine-skeleton">
        {Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} variant="rounded" width={300} height={200} animation="wave" />
        ))}
      </div>
    )
  }

  return (
    <div className="searched-container">
      {recipes.map((item) => (
        <RecipeCard key={item.id} data={item} />
      ))}
    </div>
  )
}

export default Searched
