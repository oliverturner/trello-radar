import React from 'react'
import {renderToString} from 'react-dom/server'

function render (data) {
  const html = renderToString(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <div id="app">
          <div className="radar">
            <svg className="radar__chart" viewBox="0 0 800 600">
              <g transform="translate(400, 300)" />
            </svg>
            <div className="radar__nav" />
          </div>
        </div>
      </body>
    </html>
  )

  return '<!doctype html>' + html
}

module.exports = render
