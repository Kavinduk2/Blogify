// src/components/FeaturedPosts.jsx

import React from 'react';
import PostCard from './PostCard'; // Import the card component

// Dummy data for demonstration. In a real application, you would fetch this.
const postsData = [
    {
        title: "Mastering the Art of Tailwind CSS",
        excerpt: "Learn how to use utility-first CSS frameworks like Tailwind to build beautiful and responsive UIs quickly.",
        category: "Technology",
        author: "Kavindu",
        date: "Nov 28, 2025",
        readTime: "7 min read",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        title: "10 Startup Lessons from a First-Time Founder",
        excerpt: "Navigating the initial hurdles of launching a new business and the crucial mindset shifts needed for success.",
        category: "Startup",
        author: "Alex Lee",
        date: "Dec 1, 2025",
        readTime: "12 min read",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c824cdd?auto=format&fit=crop&q=80&w=2671&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        title: "Budgeting 101: Financial Freedom in the New Year",
        excerpt: "Simple, actionable steps you can take today to get your finances in order and start saving for tomorrow.",
        category: "Finance",
        author: "Sarah Jones",
        date: "Dec 3, 2025",
        readTime: "8 min read",
        imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6aa5d?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
];

const FeaturedPosts = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        🔥 Latest & Featured Articles
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Dive into our most recent and popular posts across all categories.
                    </p>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {postsData.map((post, index) => (
                        <PostCard 
                            key={index}
                            title={post.title}
                            excerpt={post.excerpt}
                            category={post.category}
                            author={post.author}
                            date={post.date}
                            readTime={post.readTime}
                            imageUrl={post.imageUrl}
                        />
                    ))}
                </div>

                {/* View All Button - Matches your Hero button style */}
                <div className="mt-12 text-center">
                    <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-150 shadow-md">
                        View All Posts
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedPosts;