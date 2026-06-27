import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import type { Recipe as RecipeType } from '../types/recipe'
import './Recipe.css'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY as string

type Tab = 'summary' | 'ingredients' | 'steps'

const Recipe = () => {
  const [details, setDetails] = useState<RecipeType | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('summary')
  const { name } = useParams<{ name: string }>()

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${name}/information?apiKey=${API_KEY}`
      )
      const data: RecipeType = await res.json()
      setDetails(data)
    }
    fetchDetails()
  }, [name])

  if (!details) {
    return (
      <div className="recipe-shimmer-container">
        <div className="recipe-shimmer-left">
          <Skeleton height={300} />
        </div>
        <div className="recipe-shimmer-right">
          <div className="btn-shimmer-right">
            <Skeleton width={100} />
            <Skeleton width={100} />
            <Skeleton width={100} />
          </div>
          <div className="text-container-shimmer">
            {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} width="100%" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="recipe-container">
      <img src={details.image} alt={details.title} className="recipe-img" />
      <div className="recipe-right-main">
        <h1>{details.title}</h1>
        <div className="btn-container">
          {(['summary', 'ingredients', 'steps'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn-style ${activeTab === tab ? 'btn-active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'summary' && (
          <div className="summary">
            <h2>Summary</h2>
            <div dangerouslySetInnerHTML={{ __html: details.summary }} />
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="ingredients">
            <h2>Ingredients</h2>
            <ul>
              {details.extendedIngredients.map((item) => (
                <li key={item.id}>{item.original}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="instructions">
            <h2>Steps</h2>
            {details.analyzedInstructions.length > 0 ? (
              <div className="steps">
                {details.analyzedInstructions[0].steps.map((step) => (
                  <div className="step" key={step.number}>
                    <h3>Step {step.number}</h3>
                    <p>{step.step}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No step data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Recipe
