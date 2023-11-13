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
    <script async data-cfasync="false" src="//lungicko.net/1?z=6592184" />
  </>
)

export default InternalScripts
