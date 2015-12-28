import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import metrics from '../../utils/metrics'

import Segment from './bg/segment'
import QuadrantLabel from './bg/quadrant-label'
import HorizonLine from './bg/horizon-line'

import styles from './style.scss'

class Chart extends Component {
  segmentHover = (quadrantId, horizonId) => {
    this.props.dispatch({type: 'HORIZON_HOVER', payload: {quadrantId, horizonId}})
  }

  render () {
    const arr = Array(metrics.horizonNum + 1).fill()

    const circles      = arr.map((h, i) => <circle className="proto" r={metrics.getHorizonRad(i)}/>)
    const horizonLines = arr.map((h, i) => <HorizonLine index={i}/>)

    const quadrantLabels = this.props.textPathSupported
      ? this.props.quadrants.map((q) => <QuadrantLabel name={q.get('name')} arcId={q.get('labelArcId')}/>)
      : []

    const segments = this.props.segments.map((s) => <Segment {...s.toObject()} onHover={this.segmentHover}/>)

    return (
      <g>
        {[circles, horizonLines]}
        <g className={styles['container']}>
          {[quadrantLabels, segments].map((o) => o.toArray())}
        </g>
      </g>
    )
  }
}

Chart.propTypes = {
  dispatch: PropTypes.func.isRequired,

  segments:          PropTypes.object.isRequired,
  quadrants:         PropTypes.object.isRequired,
  textPathSupported: PropTypes.bool.isRequired
}

const select = (state) => {
  return {
    segments:          state.chart.get('segments'),
    quadrants:         state.chart.get('quadrants'),
    textPathSupported: state.chart.get('textPathSupported')
  }
}

export default connect(select)(Chart)
