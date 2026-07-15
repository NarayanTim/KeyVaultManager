import { Dashboard, Landing } from '@/pages'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'


const GlobalRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default GlobalRouter