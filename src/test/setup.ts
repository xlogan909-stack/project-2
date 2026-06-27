import '@testing-library/jest-dom'
import { vi } from 'vitest'

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})
