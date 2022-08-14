import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { wrapper } from './test/utils'
import { App } from './App'

test('home pages renders', () => {
  render(<App />, { wrapper })
  expect(screen.getByText(/react seed/i)).toBeInTheDocument()
})