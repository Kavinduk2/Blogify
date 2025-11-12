import React from 'react'
import { ArrowRight } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-md"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900">Quickblog</span>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full flex items-center space-x-2 transition-colors">
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>
  )
}

export default Navbar