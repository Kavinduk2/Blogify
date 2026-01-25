import React from 'react'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Login from './pages/Login'
import Register from './pages/Register'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import Dashboard from './pages/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'

import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <ErrorBoundary>
      <div>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path ='/blog'  element={<Blog/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/post/:id' element={<PostDetail/>} />
          <Route path='/create-post' element={<CreatePost/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </div>
    </ErrorBoundary>
     
  )
}

export default App