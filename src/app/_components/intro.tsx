'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export const Intro = () => {
  const [showCursor, setShowCursor] = useState<boolean>(true)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <section className='flex flex-col md:flex-row items-center md:justify-between mt-16 mb-16 md:mb-12'>
      <motion.h1
        className='text-5xl md:text-7xl font-bold tracking-tight leading-tight md:pr-8 text-accent-green'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {'>'} NotDefined.dev
        <span className={`text-gray-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
      </motion.h1>

      <motion.h4
        className='text-center md:text-left text-lg mt-5 md:pl-8 text-text opacity-80'
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      >
        &quot;Undefined Insights: Creando sin límites.&quot;
      </motion.h4>
    </section>
  )
}
