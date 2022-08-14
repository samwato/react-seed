import React, { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

export const wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MemoryRouter>
      {children}
    </MemoryRouter>
  )
}