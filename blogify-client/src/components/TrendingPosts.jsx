import React from 'react'
import { blog_data } from '../assets/assets'

const TrendingPosts = () => {
  const trending = blog_data.slice(0, 6)

  return (
    <section className="py-14 bg-white" id="trending">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-indigo-600 tracking-wide">Trending</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">What readers love right now</h3>
          </div>
          <span className="hidden sm:inline text-sm text-gray-500">Updated daily</span>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="grid grid-flow-col auto-cols-[260px] gap-4">
            {trending.map((post) => (
              <article
                key={post._id}
                className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="h-36 w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-xs font-semibold text-indigo-600 uppercase">{post.category}</span>
                  <h4 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">{post.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.subTitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrendingPosts
