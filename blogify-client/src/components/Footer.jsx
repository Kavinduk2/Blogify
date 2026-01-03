import React from 'react'
import { assets, footer_data } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={assets.logo_light} alt="Blogify" className="h-10" />
            <div>
              <p className="text-lg font-semibold">Blogify</p>
              <p className="text-sm text-gray-400">Stories that move your audience.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700">Fresh posts weekly</span>
            <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700">No spam promise</span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {footer_data.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link) => (
                  <li key={link} className="hover:text-white transition-colors cursor-pointer">{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-400 border-t border-gray-800 pt-6">
          <p>© {new Date().getFullYear()} Blogify. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a aria-label="Facebook" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition" href="#">
              <img src={assets.facebook_icon} alt="Facebook" className="h-4 w-4" />
            </a>
            <a aria-label="Twitter" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition" href="#">
              <img src={assets.twitter_icon} alt="Twitter" className="h-4 w-4" />
            </a>
            <a aria-label="Google Plus" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition" href="#">
              <img src={assets.googleplus_icon} alt="Google Plus" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
