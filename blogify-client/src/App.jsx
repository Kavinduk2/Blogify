import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PostCard from './components/PostCard'
import FeaturedPosts from './components/FeaturedPost'

const App = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <FeaturedPosts/>
    </>
     
  )
}

export default App