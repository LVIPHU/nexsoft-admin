'use client'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@nexsoft-admin/utils';

interface HoverCardProps {
  children?: React.ReactNode
  className?: string
}

export function HoverCard({ children, className }: HoverCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || window.innerWidth < 1280) return

    const { clientX, clientY } = e
    const { width, height, x, y } = ref.current.getBoundingClientRect()
    const mouseX = Math.abs(clientX - x)
    const mouseY = Math.abs(clientY - y)
    const rotateMin = -15
    const rotateMax = 15
    const rotateRange = rotateMax - rotateMin

    const rotate = {
      x: rotateMax - (mouseY / height) * rotateRange,
      y: rotateMin + (mouseX / width) * rotateRange,
    }

    setStyle({
      transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    setStyle({ transform: 'rotateX(0deg) rotateY(0deg)' })
  }, [])

  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    current.addEventListener('mousemove', onMouseMove);
    current.addEventListener('mouseleave', onMouseLeave);
    return () => {
      if (!current) return;
      current.removeEventListener('mousemove', onMouseMove);
      current.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseLeave, onMouseMove]);

  return (
    <div
      className={cn('z-10 mb-8 scale-100 transition-all duration-200 ease-out hover:z-50 md:mb-0 md:hover:scale-[1.15]', className)}
      style={{ perspective: '600px' }}
      ref={ref}
    >
      <div
        style={style}
        className={cn(
          'flex flex-col overflow-hidden transition-all duration-200 ease-out md:rounded-lg',
          'shadow-demure dark:bg-dark dark:shadow-mondegreen bg-white',
          'outline-1 outline-gray-100 outline-solid dark:outline-gray-600',
        )}
      >
        {children}
      </div>
    </div>
  );
}
