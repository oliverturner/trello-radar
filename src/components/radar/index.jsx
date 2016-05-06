import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Chart from './chart'
import Blips from './blips'
import Horizons from './horizons'

import metrics from 'utils/metrics'

class Radar extends Component {
  render () {
    const {width, height} = metrics
    const cx = width / 2
    const cy = height / 2

    if (!this.props.loaded) {
      return <svg className="radar__chart" viewBox={`0 0 ${width} ${height}`} />
    }

    return (
      <svg className="radar__chart" viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${cx}, ${cy})`}>
          <Horizons />
          <Chart />
          <Blips />
        </g>
      </svg>
    )
  }
}

Radar.propTypes = {
  loaded: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  loaded: state.chart.get('loaded')
})

export default connect(mapStateToProps)(Radar)
