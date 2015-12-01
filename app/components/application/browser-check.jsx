import React from 'react'

import styles from './style.scss'

const Msg = () => (
  <div className={styles['unsupported']}>
    <p>Sorry: your browser <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1067695">crashes on complex SVG</a></p>
    <p>Please use either Chrome or Safari.</p>
  </div>
)

export default Msg
