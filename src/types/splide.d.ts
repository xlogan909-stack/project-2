declare module '@splidejs/react-splide' {
  import type { ComponentType, ReactNode } from 'react'

  interface SplideOptions {
    perPage?: number
    pagination?: boolean
    gap?: string | number
    autoplay?: boolean
    type?: string
    [key: string]: unknown
  }

  interface SplideProps {
    options?: SplideOptions
    children?: ReactNode
    [key: string]: unknown
  }

  interface SplideSlideProps {
    children?: ReactNode
    [key: string]: unknown
  }

  export const Splide: ComponentType<SplideProps>
  export const SplideSlide: ComponentType<SplideSlideProps>
}
