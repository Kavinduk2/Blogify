import React from 'react'
import { blogCategories, blog_data } from '../assets/assets'
import PostCard from './PostCard'

const BlogList = () => {
    const [activeCategory, setActiveCategory] = React.useState('All')
    const [visibleCount, setVisibleCount] = React.useState(6)

    const filteredPosts = activeCategory === 'All'
        ? blog_data
        : blog_data.filter((post) => post.category === activeCategory)

    const visiblePosts = filteredPosts.slice(0, visibleCount)

    return (
        <section className="py-16" id="blogs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 text-center">
                    <div>
                        <p className="text-sm font-semibold text-indigo-600 tracking-wide">Browse</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Latest stories</h2>
                        <p className="text-gray-600 mt-2">Filter by category and dive into fresh articles.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        {blogCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setActiveCategory(category)
                                    setVisibleCount(6)
                                }}
                                className={`px-4 sm:px-5 py-2 rounded-full border text-sm font-medium transition-all duration-150 ${
                                    activeCategory === category
                                        ? 'bg-indigo-600 text-white shadow-md border-indigo-600'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-200 hover:text-indigo-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {visiblePosts.map((post) => (
                        <PostCard
                            key={post._id}
                            title={post.title}
                            excerpt={post.subTitle}
                            category={post.category}
                            author={post.author || 'Admin'}
                            date={new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            readTime={post.readTime || '5 min read'}
                            imageUrl={post.image}
                        />
                    ))}
                </div>

                {visibleCount < filteredPosts.length && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setVisibleCount((count) => count + 6)}
                            className="px-6 py-3 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full border border-indigo-100 transition"
                        >
                            Load more posts
                        </button>
                    </div>
                )}

                {filteredPosts.length === 0 && (
                    <p className="text-center text-gray-500 mt-12">No posts in this category yet.</p>
                )}
            </div>
        </section>
    )
}

export default BlogList