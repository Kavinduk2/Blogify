import React from 'react'

const AboutHighlights = () => {
  const items = [
    {
      title: 'Write without friction',
      desc: 'Minimal editor, instant previews, and autosave keep you in flow.',
    },
    {
      title: 'Grow your audience',
      desc: 'SEO-friendly posts, social cards, and share links baked in.',
    },
    {
      title: 'Engage your readers',
      desc: 'Comments, reactions, and newsletter signups to build community.',
    },
  ]

  return (
    <section className="py-14 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-indigo-600 tracking-wide">Why Blogify</p>
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Built for creators who ship ideas fast</h3>
          <p className="text-gray-600 mt-3">Everything you need to publish, promote, and learn what resonates—without leaving your flow.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutHighlights
