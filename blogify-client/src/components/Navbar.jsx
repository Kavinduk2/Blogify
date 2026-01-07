import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Navbar = () => {
  const navigate  = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/')
  }

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img onClick={()=>navigate('/')} src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-pointer' />

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/blog')} className="hidden sm:block text-gray-700 hover:text-blue-500 font-medium">
          Blog
        </button>
        
        {token ? (
          <>
            <button onClick={() => navigate('/create-post')} className="hidden sm:block text-gray-700 hover:text-blue-500 font-medium">
              Write
            </button>
            <button onClick={() => navigate('/dashboard')} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium">
              Dashboard
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium">
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-blue-500 text-white px-10 py-2.5 hover:bg-blue-600">
            Login
            <img src={assets.arrow} className='w-3' alt="arrow"/>
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar