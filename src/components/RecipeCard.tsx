import { Link } from 'react-router-dom'
import type { RecipeResult } from '../types/recipe'
import './RecipeCard.css'

interface Props {
  data: RecipeResult
}

const RecipeCard = ({ data }: Props) => {
  return (
    <Link to={`recipe/${data.id}`}>
      <div className="recipe-card-container">
        <img src={data.image} alt={data.title} className="recipe-img" />
        <h2 className="recipe-title">{data.title}</h2>
        <div className="recipe-gradient" />
      </div>
    </Link>
  )
}

export default RecipeCard
