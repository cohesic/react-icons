import * as React from 'react'
import { Toaster } from 'react-hot-toast'

import type { AppProps } from 'next/app'

import '../styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
