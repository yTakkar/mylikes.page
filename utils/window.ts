const _waitForGlobal = (key: string, callback: () => void, maxTime: number, spentTime: number) => {
  if (spentTime > maxTime) {
    return
  }

  // @ts-ignore
  if (window[key]) {
    callback()
  } else {
    setTimeout(function () {
      _waitForGlobal(key, callback, maxTime, spentTime + 100)
    }, 100)
  }
}

export const onWindowGlobalObjectReady = (key: string, callback: () => void, maxTime = 60 * 1000) => {
  _waitForGlobal(key, callback, maxTime, 0)
}

export const loadWindowStylesheet = (url: string, name: string): Promise<void> => {
  return new Promise(resolve => {
    const linkTag = document.createElement('link')

    const alreadyExists = document.querySelectorAll(`.${name}`)
    if (alreadyExists.length > 0) {
      return resolve()
    }
    linkTag.href = url
    linkTag.rel = 'stylesheet'
    linkTag.type = 'text/css'
    linkTag.className = name

    document.body.appendChild(linkTag)
    resolve()
  })
}

export const loadWindowJavascript = (url: string, name: string): Promise<void> => {
  return new Promise(resolve => {
    const isLoaded = document.querySelectorAll(`.${name}`)
    if (isLoaded.length > 0) {
      return resolve()
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'

    // @ts-ignore
    if (script.readyState) {
      //IE
      // @ts-ignore
      script.onreadystatechange = function () {
        // @ts-ignore
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          // @ts-ignore
          script.onreadystatechange = null
          resolve()
        }
      }
    } else {
      //Others
      script.onload = function () {
        resolve()
      }
    }

    script.src = url
    script.className = name

    document.body.appendChild(script)
  })
}
