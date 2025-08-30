import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
export default function App({ Component, pageProps }: AppProps) {

  const lenis = useLenis(()=>{

  })

  return (
    <ReactLenis options={{duration:1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))}} root>
    <main className= "font-space text-bruh-white bg-[#0c0c0c] antialiased overflow-x-hidden" >
      <Component {...pageProps} />
    </main>
    </ReactLenis>
  )
}
