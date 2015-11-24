import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Quadrant from '../../components/quadrant'
import Blip from '../../components/blip'

class Application extends Component {
  render () {
    const {width, height} = this.props.metrics
    const cx = width / 2
    const cy = height / 2

    const t  = `translate(${cx}, ${cy})`
    const vb = `0 0 ${width} ${height}`

    const quads = this.props.segments.map((q, i) => <Quadrant {...q} />)
    const blips = this.props.blips.map((b, i) => <Blip {...b} />)

    return (
      <div className="radar">
        <svg className="radar__chart" viewBox={vb}>
          <g transform={t}>{[quads, blips]}</g>
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
