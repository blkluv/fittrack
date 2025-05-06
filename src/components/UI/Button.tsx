import React from 'react'

/**
 * @description Reusable button component with customizable styles and click handling.
 *
 * @example
 * // Basic usage:
 * <Button onClick={() => console.log('Button clicked')}>Click Me</Button>
 *
 * // As a link:
 * <Button href="/about">Learn More</Button>
 */
interface ButtonProps {
  /**
   * Optional URL to navigate to when the button is clicked.
   * If provided, the button will render as an `<a>` tag.
   */
  href?: string
  /**
   * Optional click event handler.
   * If provided, the function will be executed when the button is clicked.
   */
  onClick?: () => void
  /**
   * The content to display within the button.
   */
  children: React.ReactNode
  /**
   * Optional CSS class names to apply to the button.
   * Tailwind CSS classes are supported.
   */
  className?: string
  /**
   * Optional aria-label
   */
  ariaLabel?: string
}

const Button: React.FC<ButtonProps> = ({
  href,
  onClick,
  children,
  className,
  ariaLabel,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground'

  const handleClick = () => {
    try {
      onClick?.()
    } catch (error: any) {
      console.error('Error during button click:', error.message)
    }
  }

  if (href) {
    const sanitizedHref = String(href).trim()
    return (
      <a
        href={sanitizedHref}
        className={`${baseClasses} ${className || ''}`}
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      className={`${baseClasses} ${className || ''}`}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export { Button }