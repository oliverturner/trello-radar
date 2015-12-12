import React, {Component, PropTypes} from 'react'

import metrics from '../../utils/metrics'

import Blip from './blip'
import Segment from './segment'
import QuadrantLabel from './quadrant-label'
import HorizonLine from './horizon-line'
import HorizonLabel from './horizon-label'

import styles from './style.scss'

class Chart extends Component {
  segmentHover = (horizonId) => {
    this.props.dispatch({type: 'HORIZON_HOVER', horizonId})
  }

  blipClick = (cardId) => {
    this.props.dispatch({type: 'CARD_SELECT', cardId})
  }

  blipHover = (cardId, quadrantId, horizonId) => {
    this.props.dispatch({type: 'CARD_HOVER', cardId, quadrantId, horizonId})
  }

  render () {
    const {width, height} = metrics
    const cx = width / 2
    const cy = height / 2

    const arr = Array(metrics.horizonNum + 1).fill()

    const circles      = arr.map((h, i) => <circle className="proto" r={metrics.getHorizonRad(i)}/>)
    const horizonLines = arr.map((h, i) => <HorizonLine index={i}/>)

    const horizonLabels = this.props.horizons.map((h, i) =>
      <HorizonLabel index={i} name={h.name} selected={h.id === this.props.horizonSelected}/>
    )

    const segments = Object.keys(this.props.segments).map((key) =>
      <Segment {...this.props.segments[key]} onHover={this.segmentHover}/>
    )

    const blips = this.props.cards.map((c) =>
      <Blip {...c} blipClick={this.blipClick} blipHover={this.blipHover}/>
    )

    const quadrantLabels = this.props.textPathSupported
      ? this.props.quadrants.map((q, i) => <QuadrantLabel name={q.name} arcId={q.labelArcId}/>)
      : []

    return (
      <svg className="radar__chart" viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${cx}, ${cy})`}>{
          [circles, horizonLines]
        }</g>
        <g className={styles['container']} transform={`translate(${cx}, ${cy})`}>{
          [horizonLabels, quadrantLabels, segments, blips]
        }</g>
      </svg>
    )
  }
}

Chart.propTypes = {
  dispatch: PropTypes.func.isRequired,

  segments:  PropTypes.object.isRequired,
  quadrants: PropTypes.array.isRequired,
  horizons:  PropTypes.array.isRequired,
  cards:     PropTypes.array.isRequired,

  textPathSupported: PropTypes.bool,
  horizonSelected:   PropTypes.string
}

export default Chart
