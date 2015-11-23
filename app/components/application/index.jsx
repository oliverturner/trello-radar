import React from 'react'
import {connect} from 'react-redux'

import Quadrant from '../../components/quadrant'

import styles from './style.scss'

class Application extends React.Component {
  render () {
    const w       = this.props.metrics.width
    const h       = this.props.metrics.height
    const viewBox = `0 0 ${w} ${h}`

    const cx = w / 2
    const cy = h / 2
    const t  = `translate(${cx}, ${cy})`

    return (
      <svg className={styles.wrap} viewBox={viewBox}>
        <g transform={t}>
          {this.props.quadrants.map((q, i) =>
            <Quadrant key={i} {...q} metrics={this.props.metrics} />
          )}
        </g>
      </svg>
    )
  }
}

function select (state) {
  return {...state}
}

export default connect(select)(Application)
