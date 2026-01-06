import React from 'react'
import { assets } from '../assets/assets'



const Header = () => {
  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'> 
        <div className='text-center mt-20 mb-8'>
            <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary'>
                <p>New: AI feature integrated</p>
                <img src={assets.star_icon} alt='' className='w-2.5' />
            </div>

            <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-grey-700'>Your Own <span className='text-primary'> blogging</span> Platform.</h1>
           
           <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>
            This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
           </p>

           <form className='flex gap-3 max-w-lg mx-auto border border-gray-300 bg-white rounded p-1'>
            <input type="text" placeholder='Search for blogs' required className='w-full px-4 py-2 outline-none'/>
            <button type='submit' className='bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition-all rounded cursor-pointer font-semibold flex-shrink-0'>Search</button>
           </form>

        </div>
        <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50'/>
    </div>
  )
}

export default Header