import React from 'react'
import {renderToString} from 'react-dom/server'

import bg from './components/application/bg'

function render (data) {
  const html = renderToString(
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
      </head>
      <body>
        <div id="app">
          {bg}
        </div>
      </body>
    </html>
  )

  return html
}

module.exports = render
