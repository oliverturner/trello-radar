import React, {Component, PropTypes} from 'react'

import metrics from '../../utils/metrics'

import Blip from './blip'
import Segment from './segment'
import QuadrantLabel from './quadrant-label'

class Chart extends Component {
  blipClick = (cardId) => {
    this.props.dispatch({type: 'CARD_SELECT', cardId})
  }

  blipHover = (cardId, quadrantId) => {
    //window.location.hash = quadrantId || ''

    this.props.dispatch({type: 'CARD_HOVER', cardId})
  }

  render () {
    const {width, height} = metrics
    const cx = width / 2
    const cy = height / 2

    const sKeys    = Object.keys(this.props.segments)
    const segments = sKeys.map((key) =>
      <Segment {...this.props.segments[key]} />
    )

    const blips = this.props.cards.map((c) => {
      if (c.displayed) {
        return <Blip {...c} blipClick={this.blipClick} blipHover={this.blipHover}/>
      }
    })

    const labels = this.props.quadrants.map((q, i) =>
      <QuadrantLabel name={q.name} arcId={q.labelArcId}/>
    )

    return (
      <svg className="radar__chart" viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${cx}, ${cy})`}>{[segments, labels, blips]}</g>
      </svg>
    )
  }
}

Chart.propTypes = {
  dispatch: PropTypes.func.isRequired,

  segments:  PropTypes.object.isRequired,
  quadrants: PropTypes.array.isRequired,
  cards:     PropTypes.array.isRequired
}

export default Chart
