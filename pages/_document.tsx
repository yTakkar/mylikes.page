/* eslint-disable @next/next/no-sync-scripts */
import React from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import MetaTags from '../scriptTemplates/meta'
import PreconnectUrls from '../scriptTemplates/preConnects'
import { AnalyticsScripts } from '../scriptTemplates/analytics'
import InternalScripts from '../scriptTemplates/internal'
import AdScripts from '../scriptTemplates/ads'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <InternalScripts />
          <PreconnectUrls />
          <AnalyticsScripts />
          <AdScripts />
          <MetaTags />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
