import React from 'react'

const InternalScripts = () => (
  <>
    <script
      type="text/javascript"
      nonce="-Jv3vXWEec5rT0Unhie_"
      dangerouslySetInnerHTML={{
        __html: `
          let vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', vh + 'px');
        `,
      }}
    />
  </>
)

export default InternalScripts
