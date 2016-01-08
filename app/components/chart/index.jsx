import React, {Component, PropTypes} from 'react'
import {Range} from 'immutable'
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
    const range        = Range(0, metrics.horizonNum + 1)
    const circles      = range.map((h, i) => <circle className="proto" r={metrics.getHorizonRad(i)}/>)
    const horizonLines = range.map((h, i) => <HorizonLine index={i}/>)

    const quadrantLabels = this.props.textPathSupported
      ? this.props.quadrants.map((q) => <QuadrantLabel name={q.get('name')} arcId={q.get('labelArcId')}/>).toArray()
      : []

    const segments = this.props.segments.map((s) => <Segment {...s.toObject()} onHover={this.segmentHover}/>).toArray()

    return (
      <g>
        {[circles, horizonLines]}
        <g className={styles['container']}>
          {[quadrantLabels, segments]}
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
