// src/components/PostCard.jsx

import React from 'react';

const PostCard = ({ title, excerpt, category, author, date, readTime, imageUrl }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 ease-in-out border border-gray-100">
            {/* Post Image */}
            <div className="h-48 overflow-hidden">
                {/* Placeholder Image: Replace with actual image in production */}
                <img 
                    src={imageUrl || "https://images.unsplash.com/photo-1549490349-864332e3b2d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-6">
                {/* Category Badge - Matches your purple accent */}
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    {category || "Uncategorized"}
                </span>

                {/* Post Title */}
                <a href="#" className="block mt-2 text-xl font-bold text-gray-900 hover:text-indigo-600 transition duration-150">
                    {title || "Default Blog Post Title Here"}
                </a>

                {/* Post Excerpt */}
                <p className="mt-2 text-gray-500 text-base">
                    {excerpt || "A brief summary of the post content to entice the reader. It should be concise and engaging."}
                </p>

                {/* Post Metadata */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        <span>{author || "Author Name"}</span>
                        <span className="text-gray-300">|</span>
                        <span>{date || "Dec 4, 2025"}</span>
                    </div>
                    <span>{readTime || "5 min read"}</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;