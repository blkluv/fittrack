import React, { Suspense } from 'react'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { CallToAction } from '@/components/CallToAction'
import { Footer } from '@/components/Footer'

const App: React.FC = () => {
  return (
    <div
      className="app-container font-sans antialiased bg-gray-100 text-gray-900"
      aria-label="Fitness Tracker 3D Application"
    >
      <Suspense fallback={<div>Loading Hero Section...</div>}>
        <Hero />
      </Suspense>
      <Suspense fallback={<div>Loading Features Section...</div>}>
        <Features />
      </Suspense>
      <Suspense fallback={<div>Loading Call To Action Section...</div>}>
        <CallToAction />
      </Suspense>
      <Footer />
    </div>
  )
}

export default App