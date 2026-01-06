import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Navbar = () => {
  const navigate  = useNavigate()
  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img onClick={()=>navigate('/')} src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-p' />

      <button onClick={() => navigate('/admin')} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-blue-500 text-white px-10 py-2.5" cursor-pinter>
        Login
        <img src={assets.arrow} className='w-3' alt="arrow"/>
        </button>
        
        
      </div>
  )
}

export default Navbar