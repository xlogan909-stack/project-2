import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from '../components/Header'
import Category from '../components/Category'
import Search from '../components/Search'
import Home from './Home'
import Cuisine from './Cuisine'
import Searched from './Searched'
import Recipe from './Recipe'

const Pages = () => {
  return (
    <Router>
      <Header />
      <div className="pages-container">
        <Routes>
          <Route path="/" element={<><Search /><Category /><Home /></>} />
          <Route path="/cuisine/:type" element={<><Search /><Category /><Cuisine /></>} />
          <Route path="/searched/:search" element={<><Search /><Category /><Searched /></>} />
          <Route path="/searched/:search/recipe/:name" element={<Recipe />} />
          <Route path="/cuisine/:type/recipe/:name" element={<Recipe />} />
          <Route path="/recipe/:name" element={<Recipe />} />
        </Routes>
      </div>
    </Router>
  )
}

export default Pages
