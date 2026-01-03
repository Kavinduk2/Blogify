import React from 'react'

const NewsletterCTA = () => {
  return (
    <section className="py-16" id="newsletter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 text-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold">Stay in the loop</p>
            <h3 className="text-3xl sm:text-4xl font-bold">Weekly stories, zero spam</h3>
            <p className="text-indigo-100">Get hand-picked reads, creator tips, and platform updates delivered each Sunday.</p>
          </div>

          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition shadow"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-indigo-100 text-center mt-4">No noise. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}

export default NewsletterCTA
