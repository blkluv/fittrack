import React, { memo } from 'react'
import { Activity, Target, TrendingUp, Share2 } from 'lucide-react'
import { Card } from '@/components/UI/Card'

interface Feature {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const defaultFeatures: Feature[] = [
  {
    id: 1,
    title: '3D Visualization',
    description:
      'Visualize your fitness journey in an immersive 3D environment. Experience your progress like never before.',
    icon: <Activity />,
  },
  {
    id: 2,
    title: 'Goal Setting',
    description: 'Set personalized fitness goals and track your progress with ease. Stay motivated and achieve your dreams.',
    icon: <Target />,
  },
  {
    id: 3,
    title: 'Progress Tracking',
    description: 'Monitor your achievements and stay motivated on your fitness journey. See how far you have come and keep going.',
    icon: <TrendingUp />,
  },
  {
    id: 4,
    title: 'Social Sharing',
    description: 'Share your successes with friends and family. Celebrate your milestones and inspire others.',
    icon: <Share2 />,
  },
]

interface FeaturesProps {
  features?: Feature[]
}

const Features: React.FC<FeaturesProps> = ({ features = defaultFeatures }) => {
  return (
    <section
      className="py-12 bg-gray-50"
      aria-label="Key Features of Fitness Tracker 3D"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Key Features
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            let safeDescription = feature.description;
            const invalidIcon = React.isValidElement(feature.icon) === false;

            if (typeof feature.description === 'string') {
                const descriptionRegex = /<[^>]*>/g;
                safeDescription = feature.description.replace(descriptionRegex, ''); // basic HTML tag removal
            } else {
                safeDescription = 'Invalid description format';
            }

            const renderIcon = () => {
              if (invalidIcon) {
                console.error(`Invalid icon provided for feature: ${feature.title}`)
                return <Activity aria-label="Placeholder Icon" /> // Placeholder icon
              }
              return feature.icon
            }

            try {
              return (
                <Card key={feature.id}>
                  <div className="flex flex-col items-center justify-center p-6">
                    <div className="w-12 h-12 text-gray-700 mb-4" aria-hidden="true">
                      {renderIcon()}
                    </div>
                    <h3
                      className="text-xl font-medium text-gray-900 mb-2"
                      aria-label={`Feature: ${feature.title}`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-gray-600 text-center"
                      aria-label={`Description: ${feature.title} - ${safeDescription}`}
                    >
                      {safeDescription}
                    </p>
                  </div>
                </Card>
              )
            } catch (error: any) {
              console.error('Error rendering feature:', error)
              return (
                <div
                  key={feature.id}
                  className="col-span-1 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline">
                    {' '}
                    Failed to load this feature. Please try again later.
                  </span>
                </div>
              )
            }
          })}
        </div>
      </div>
    </section>
  )
}

export { Features }