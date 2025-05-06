import React, { memo } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}

const Card: React.FC<CardProps> = memo(
  ({ children, className, ariaLabel }) => {
    let safeAriaLabel = ariaLabel

    if (typeof ariaLabel === 'string') {
      const labelRegex = /<[^>]*>/g
      safeAriaLabel = ariaLabel.replace(labelRegex, '')
    } else {
      safeAriaLabel = 'Card container'
    }

    return (
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 ${
          className || ''
        }`.trim()}
        aria-label={safeAriaLabel}
        role="region"
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }