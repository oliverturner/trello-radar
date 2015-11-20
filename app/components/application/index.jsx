import React from 'react'
import {connect} from 'react-redux'

import Quadrant from '../../components/quadrant'

import styles from './style.scss'

class Application extends React.Component {
  render () {
    console.log(this.props)

    return (
      <div className={styles.main}>
        <svg className={styles.wrap} viewBox="0 0 800 600">
          <Quadrant/>
        </svg>
      </div>
    )
  }
}

function select (state) {
  return {...state}
}

export default connect(select)(Application)
