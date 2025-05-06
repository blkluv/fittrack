import React, { memo } from 'react'
import { Share2 } from 'lucide-react'
import '@/styles/index.css'

const Footer: React.FC = memo(() => {
  let currentYear: number
  try {
    currentYear = new Date().getFullYear()
  } catch (error) {
    console.error('Failed to determine current year:', error)
    currentYear = NaN
  }

  const yearToDisplay = isNaN(currentYear) ? 'Unknown Year' : currentYear

  return (
    <section
      className="bg-gray-100 py-4 text-center"
      aria-label="Footer with Copyright and Social Media Links"
    >
      <div className="container mx-auto">
        <p className="text-gray-600 text-sm" aria-label="Copyright Information">
          &copy; {yearToDisplay} Fitness Tracker 3D. All rights reserved.
        </p>
        <div>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mx-2 text-gray-500 hover:text-gray-700"
            aria-label="Facebook"
          >
            <Share2 size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mx-2 text-gray-500 hover:text-gray-700"
            aria-label="Twitter"
          >
            <Share2 size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mx-2 text-gray-500 hover:text-gray-700"
            aria-label="Instagram"
          >
            <Share2 size={20} />
          </a>
        </div>
      </div>
    </section>
  )
})

Footer.displayName = 'Footer'

export { Footer }