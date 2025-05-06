import React, { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationProps {
  target: string | React.RefObject<HTMLElement>
  start: string
  end: string
  animation: gsap.core.Animation
  markers?: boolean
}

const useScrollAnimation = ({
  target,
  start,
  end,
  animation,
  markers = false,
}: ScrollAnimationProps): void => {
  useEffect(() => {
    let scrollTriggerInstance: ScrollTrigger | undefined

    try {
      const targetElement = gsap.utils.toArray(target)[0]

      if (!targetElement) {
        console.error('Target element not found for ScrollTrigger:', target)
        return
      }

      if (typeof start !== 'string' || typeof end !== 'string') {
        console.error('Invalid start or end value. Must be a string.')
        return
      }

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: targetElement,
        start: start,
        end: end,
        animation: animation,
        scrub: true,
        markers: markers,
      })
    } catch (error) {
      console.error('Error creating ScrollTrigger:', error)
    }

    return () => {
      try {
        scrollTriggerInstance?.kill()
      } catch (error) {
        console.error('Error killing ScrollTrigger:', error)
      }
    }
  }, [target, start, end, animation, markers])
}

export default useScrollAnimation