import { useState, useEffect } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Skeleton } from '@mui/material'
import type { Recipe } from '../types/recipe'
import RecipeCard from './RecipeCard'
import '@splidejs/splide/dist/css/splide.min.css'
import './Veggie.css'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY as string

const Veggie = () => {
  const [veggie, setVeggie] = useState<Recipe[]>([])

  useEffect(() => {
    const getVeggie = async () => {
      const cached = localStorage.getItem('veggie')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVeggie(parsed)
            return
          }
        } catch {
          localStorage.removeItem('veggie')
        }
      }
      const res = await fetch(
        `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=10&tags=vegetarian`
      )
      const data = await res.json()
      if (Array.isArray(data.recipes)) {
        localStorage.setItem('veggie', JSON.stringify(data.recipes))
        setVeggie(data.recipes)
      }
    }
    getVeggie()
  }, [])

  const splideOptions = { perPage: 4, pagination: false, gap: '2rem' }

  if (veggie.length === 0) {
    return (
      <Splide options={splideOptions}>
        {Array.from({ length: 4 }, (_, i) => (
          <SplideSlide key={i}>
            <Skeleton height={200} width={300} />
          </SplideSlide>
        ))}
      </Splide>
    )
  }

  return (
    <div className="veggie-container">
      <h1>Veggie Picks</h1>
      <Splide options={splideOptions}>
        {veggie.map((recipe) => (
          <SplideSlide key={recipe.id}>
            <RecipeCard data={recipe} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}

export default Veggie
