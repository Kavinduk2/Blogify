import React from 'react'
import { Sparkles } from 'lucide-react'

const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-8">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">Fresh stories weekly</span>
      </div>

      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
        Ship ideas fast on <span className="text-indigo-600">Blogify</span>.
      </h1>

      <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
        Publish in minutes, grow your audience, and learn what resonates—all in one place. Your next standout post starts here.
      </p>

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

      <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
        <span className="px-3 py-1 bg-gray-100 rounded-full">AI-assisted drafting</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full">SEO-ready pages</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full">Newsletter growth</span>
      </div>
    </div>
  )
}

export default Hero