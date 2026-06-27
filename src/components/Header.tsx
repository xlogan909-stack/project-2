import { Link } from 'react-router-dom'
import { GiSpoon } from 'react-icons/gi'
import { BiSolidUserCircle } from 'react-icons/bi'
import './Header.css'

const Header = () => {
  return (
    <header className="header-container">
      <Link to="/">
        <h1>
          All Recipes
          <GiSpoon />
        </h1>
      </Link>
      <BiSolidUserCircle className="user-img" />
    </header>
  )
}

export default Header
