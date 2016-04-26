import React, {Component, PropTypes} from 'react'
import {Range} from 'immutable'
import {connect} from 'react-redux'

import metrics from '../../utils/metrics'

import Segment from './bg/segment'
import QuadrantLabel from './bg/quadrant-label'
import HorizonLine from './bg/horizon-line'

import styles from './styles.pcss'

class Chart extends Component {
  constructor (props) {
    super(props)

    this.onSegmentHover = (quadrantId, horizonId) => () => {
      this.props.dispatch({
        type:    'HORIZON_HOVER',
        payload: {quadrantId, horizonId}
      })
    }

    this.onSegmentLeave = () => {
      this.props.dispatch({type: 'HORIZON_HOVER', payload: {}})
    }
  }

  getCircles (n) {
    return n.map((h, i) =>
      <circle className={styles['proto']} r={metrics.getHorizonRad(i)}/>
    )
  }

  getHorizonLines (n) {
    return n.map((h, i) =>
      <HorizonLine index={i}/>
    )
  }

  getQuadrantLabels (quadrants) {
    return quadrants.map((q) =>
      <QuadrantLabel name={q.get('name')} arcId={q.get('labelArcId')}/>
    ).toArray()
  }

  getSegments (segments) {
    return segments.map((s) =>
      <Segment {...s.toObject()}
        onSegmentHover={this.onSegmentHover(s.get('quadrantId'), s.get('horizonId'))}
        onSegmentLeave={this.onSegmentLeave}/>
    ).toArray()
  }

  render () {
    const range = Range(0, metrics.horizonNum + 1)

    const circles        = this.getCircles(range)
    const horizonLines   = this.getHorizonLines(range)
    const segments       = this.getSegments(this.props.segments)
    const quadrantLabels = this.getQuadrantLabels(this.props.quadrants)

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

  segments:  PropTypes.object.isRequired,
  quadrants: PropTypes.object.isRequired
}

const select = (state) => ({
  segments:          state.chart.get('segments'),
  quadrants:         state.chart.get('quadrants'),
  textPathSupported: state.chart.get('textPathSupported')
})

export default connect(select)(Chart)
