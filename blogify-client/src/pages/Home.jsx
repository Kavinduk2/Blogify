import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedPosts from '../components/FeaturedPost'
import BlogList from '../components/BlogList'
import TrendingPosts from '../components/TrendingPosts'
import NewsletterCTA from '../components/NewsletterCTA'
import AboutHighlights from '../components/AboutHighlights'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Hero />
        <AboutHighlights />
        <TrendingPosts />
        <FeaturedPosts />
        <NewsletterCTA />
        <BlogList />
      </main>
      <Footer />
    </div>
  )
}

export default Home