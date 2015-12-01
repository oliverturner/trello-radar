import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Chart from '../chart'
import Nav from '../nav'

import styles from './style.scss'

class Application extends Component {
  render () {
    return (
      <div className={styles['radar']}>
        <Chart {...this.props} />
        <div className={styles['radar__nav']}>
          <Nav quadrants={this.props.quadrants}/>
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  quadrants: PropTypes.array.isRequired
}

function select (state) {
  return {...state}
}

export default connect(select)(Application)
