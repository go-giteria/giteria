import { clsx } from 'clsx'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({ 
  children, 
  className, 
  padding = 'md', 
  hover = false 
}: CardProps) {
  const baseClasses = 'bg-white border border-gray-200 rounded-lg shadow-sm'
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : ''

  return (
    <div className={clsx(
      baseClasses,
      paddingClasses[padding],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  )
}