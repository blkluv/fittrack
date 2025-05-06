import React, { memo } from 'react'
import { Button } from '@/components/UI/Button'

interface CallToActionProps {
  title?: string
  description?: string
  buttonLabel?: string
}

const CallToAction: React.FC<CallToActionProps> = memo(
  ({
    title = 'Ready to Get Started?',
    description = 'Join our fitness tracker community today!',
    buttonLabel = 'Sign Up Now',
  }) => {
    let safeTitle = title
    let safeDescription = description

    if (typeof title === 'string') {
      const titleRegex = /<[^>]*>/g
      safeTitle = title.replace(titleRegex, '')
    } else {
      console.error('Invalid title format')
      safeTitle = 'Ready to Get Started?'
    }

    if (typeof description === 'string') {
      const descriptionRegex = /<[^>]*>/g
      safeDescription = description.replace(descriptionRegex, '')
    } else {
      console.error('Invalid description format')
      safeDescription = 'Join our fitness tracker community today!'
    }

    return (
      <section
        className="py-12 bg-green-100 rounded-lg shadow-md text-center"
        aria-label="Call to Action"
      >
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-semibold text-gray-800 mb-4"
            aria-label="Call to Action Title"
          >
            {safeTitle}
          </h2>
          <p
            className="text-lg text-gray-700 mb-6"
            aria-label="Call to Action Description"
          >
            {safeDescription}
          </p>
          <Button href="/signup">{buttonLabel}</Button>
        </div>
      </section>
    )
  }
)

CallToAction.displayName = 'CallToAction'

export { CallToAction }