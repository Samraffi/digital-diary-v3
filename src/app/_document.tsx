'use client'

import { Html, Head, Main, NextScript } from 'next/document'
import { Provider } from 'react-redux'
import { store } from '@/lib/redux/store'

export default function Document() {
  return (
    <Html lang="ru">
      <Head />
      <body>
        <Provider store={store}>
          <Main />
          <NextScript />
        </Provider>
      </body>
    </Html>
  )
}