import React from 'react'
import { Search, Sparkles } from 'lucide-react'

const Hero = () => {

    const categories = ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance'];
    const [activeCategory, setActiveCategory] = React.useState('All');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">New: AI feature integrated</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Your own <span className="text-indigo-600">blogging</span>
          <br />
          platform.
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex bg-white rounded-full shadow-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search for blogs"
              className="flex-1 px-6 py-4 text-gray-700 focus:outline-none"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
  )
}

export default Hero