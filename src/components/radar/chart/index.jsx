import React, {Component, PropTypes} from 'react'
import {Range} from 'immutable'
import {connect} from 'react-redux'

import metrics from 'utils/metrics'

import Segment from './segment'
import QuadrantLabel from './quadrant-label'
import HorizonLine from './horizon-line'

import styles from './styles.pcss'

class Chart extends Component {
  constructor (props) {
    super(props)

    this.onSegmentHover = (payload = {}) => () => {
      this.props.onSegmentHover(payload)
    }
  }

  getCircles (n) {
    return n.map((h, i) =>
      <circle className={styles['proto']} r={metrics.getHorizonRad(i)} />
    )
  }

  getHorizonLines (n) {
    return n.map((h, i) =>
      <HorizonLine index={i} />
    )
  }

  getQuadrantLabels (quadrants) {
    return quadrants.map((q) =>
      <QuadrantLabel name={q.get('name')} arcId={q.get('labelArcId')} />
    ).toArray()
  }

  getSegments (segments) {
    return segments.map((s) =>
      <Segment id={s.get('id')} fill={s.get('fill')} d={s.get('d')}
        onSegmentHover={this.onSegmentHover({horizonId: s.get('horizonId')})}
        onSegmentLeave={this.onSegmentHover()} />
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
  segments:       PropTypes.object.isRequired,
  quadrants:      PropTypes.object.isRequired,
  onSegmentHover: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  segments:  state.chart.get('segments'),
  quadrants: state.chart.get('quadrants')
})

const mapDispatchToProps = (dispatch) => ({
  onSegmentHover: (payload) => dispatch({type: 'HORIZON_HOVER', payload})
})

export default connect(mapStateToProps, mapDispatchToProps)(Chart)
