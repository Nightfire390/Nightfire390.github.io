import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import localFont from 'next/font/local'
import { Space_Grotesk } from 'next/font/google'

const space = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
})
 
const bitcount = localFont({
    variable: '--font-bitcount',
    src: "../public/font/Bitcount-Regular.ttf"
})

export default function App({ Component, pageProps }: AppProps) {
  const lenis = useLenis(()=>{

  })

  return (
    <ReactLenis options={{duration:1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))}} root>
    <main className={ `${space.className} ${bitcount.variable} text-bruh-white bg-[#0c0c0c] antialiased overflow-x-hidden` } >
      <Component {...pageProps} />
    </main>
    </ReactLenis>
  )
}
