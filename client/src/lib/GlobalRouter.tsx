import { Dashboard, Landing, Project, ProjectDetails } from '@/pages'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'


const GlobalRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/projects" element={<ProtectedRoute><Project/></ProtectedRoute>}/>
        <Route path="/project/:projectId" element={<ProtectedRoute><ProjectDetails/></ProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default GlobalRouter