import { NavLink } from 'react-router-dom'
import { FaPizzaSlice, FaHamburger } from 'react-icons/fa'
import { GiNoodles, GiChopsticks } from 'react-icons/gi'
import './Category.css'

const categories = [
  { path: '/cuisine/Italian', icon: <FaPizzaSlice />, label: 'Italian' },
  { path: '/cuisine/American', icon: <FaHamburger />, label: 'American' },
  { path: '/cuisine/Thai', icon: <GiNoodles />, label: 'Thai' },
  { path: '/cuisine/Chinese', icon: <GiChopsticks />, label: 'Chinese' },
]

const Category = () => {
  return (
    <nav className="category-container">
      {categories.map(({ path, icon, label }) => (
        <NavLink key={path} to={path}>
          {icon}
          <p>{label}</p>
        </NavLink>
      ))}
    </nav>
  )
}

export default Category
