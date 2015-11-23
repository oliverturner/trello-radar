import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Quadrant from '../../components/quadrant'
import Blip from '../../components/blip'

import styles from './style.scss'

class Application extends Component {
  render () {
    const w       = this.props.metrics.width
    const h       = this.props.metrics.height
    const viewBox = `0 0 ${w} ${h}`

    const cx = w / 2
    const cy = h / 2
    const t  = `translate(${cx}, ${cy})`

    return (
      <div className="radar">
        <svg className="radar__chart" viewBox={viewBox}>
          <g transform={t}>{this.props.segments.map((q, i) => <Quadrant key={`s-${i}`} {...q} />)}</g>
          <g transform={t}>{this.props.blips.map((b, i) => <Blip key={`b-${i}`} {...b} />)}</g>
        </svg>
        <div className="radar__nav"></div>
      </div>
    )
  }
}

Application.propTypes = {
  metrics: PropTypes.shape({
    width:  PropTypes.number,
    height: PropTypes.number
  }).isRequired,

  segments: PropTypes.array.isRequired,
  blips:    PropTypes.array.isRequired
}

function select (state) {
  return {...state}
}

export default connect(select)(Application)
