import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import type { RecipeResult } from '../types/recipe'
import RecipeCard from '../components/RecipeCard'
import './Cuisine.css'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY as string

const Cuisine = () => {
  const [cuisine, setCuisine] = useState<RecipeResult[]>([])
  const { type } = useParams<{ type: string }>()

  useEffect(() => {
    const getCuisine = async () => {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&cuisine=${type}`
      )
      const data = await res.json()
      setCuisine(data.results ?? [])
    }
    getCuisine()
  }, [type])

  if (cuisine.length === 0) {
    return (
      <div className="cuisine-skeleton">
        {Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} variant="rounded" width={300} height={200} animation="wave" />
        ))}
      </div>
    )
  }

  return (
    <div className="cuisine-container">
      {cuisine.map((item) => (
        <RecipeCard key={item.id} data={item} />
      ))}
    </div>
  )
}

export default Cuisine
