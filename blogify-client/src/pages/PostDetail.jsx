import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(response.data);
        if (response.data.author) {
          setAuthor(response.data.author);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/blog')}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          ← Back to Blog
        </button>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              {author && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{author.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{author.name}</p>
                    <p className="text-sm text-gray-500">{author.email}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 text-sm text-gray-500">
                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                {post.tags && post.tags.length > 0 && (
                  <span className="flex gap-2">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 italic">{post.excerpt}</p>
            )}

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {post.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Status: <span className="capitalize font-semibold text-gray-700">{post.status}</span>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
