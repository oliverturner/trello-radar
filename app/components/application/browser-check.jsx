import React from 'react'

const Msg = () => (
  <div className="unsupported">
    <p>Sorry: your browser <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1067695">crashes on complex SVG</a></p>
    <p>Please use either Chrome or Safari.</p>
  </div>
)

export default Msg
