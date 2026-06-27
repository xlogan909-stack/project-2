import { useEffect, useState } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Skeleton } from '@mui/material'
import type { Recipe } from '../types/recipe'
import RecipeCard from './RecipeCard'
import '@splidejs/splide/dist/css/splide.min.css'
import './Popular.css'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY as string

const Popular = () => {
  const [popular, setPopular] = useState<Recipe[]>([])

  useEffect(() => {
    const getPopular = async () => {
      const cached = localStorage.getItem('popular')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPopular(parsed)
            return
          }
        } catch {
          localStorage.removeItem('popular')
        }
      }
      const res = await fetch(
        `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=10`
      )
      const data = await res.json()
      if (Array.isArray(data.recipes)) {
        localStorage.setItem('popular', JSON.stringify(data.recipes))
        setPopular(data.recipes)
      }
    }
    getPopular()
  }, [])

  const splideOptions = { perPage: 4, pagination: false, gap: '2rem' }

  if (popular.length === 0) {
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
    <div className="popular-container">
      <h1>Popular</h1>
      <Splide options={splideOptions}>
        {popular.map((recipe) => (
          <SplideSlide key={recipe.id}>
            <RecipeCard data={recipe} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}

export default Popular
