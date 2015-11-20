import React from 'react'

import Quadrant from '../../components/quadrant'

import styles from './style.scss'

class Application extends React.Component {
  render () {
    return (
      <div className={styles.main}>
        <svg className={styles.wrap} viewBox="0 0 800 600">
          <Quadrant/>
        </svg>
      </div>
    )
  }
}

export default Application
