import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import './Search.css'

const Search = () => {
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim()) navigate(`/searched/${input.trim()}`)
  }

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <FaSearch />
        <input
          type="text"
          className="search-field"
          placeholder="Search recipes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  )
}

export default Search
