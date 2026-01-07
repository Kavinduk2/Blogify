import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    status: 'draft',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        status: formData.status,
      };

      const response = await axios.post('http://localhost:5000/api/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate(`/post/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Post</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter post title"
              maxLength="140"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/140</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              rows="3"
              placeholder="Brief summary of your post (optional)"
              maxLength="280"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/280</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
              rows="12"
              placeholder="Write your post content here..."
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Separate tags with commas (e.g., react, javascript, web)"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
