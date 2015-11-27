import React, {Component, PropTypes} from 'react'

import metrics from '../../utils/metrics'

import Blip from './blip'
import Quadrant from './quadrant'
import QuadrantLabel from './quadrant-label'

class Chart extends Component {
  blipClick = (blipId) => {
    this.props.dispatch({type: 'CARD_SELECT', cardId: blipId})
  }

  blipHover = (blipId) => {
    this.props.dispatch({type: 'CARD_HOVER', cardId: blipId})
  }

  render () {
    const {width, height} = metrics
    const cx = width / 2
    const cy = height / 2

    const sKeys = Object.keys(this.props.segments)
    const quads = sKeys.map((key) =>
      <Quadrant {...this.props.segments[key]} />
    )

    const blips = this.props.cards.map((c) => {
      if (c.displayed) {
        return <Blip {...c} blipClick={this.blipClick} blipHover={this.blipHover} />
      }
    })

    const labels = this.props.quadrants.map((q, i) =>
      <QuadrantLabel index={i} name={q.name}/>
    )

    return (
      <svg className="radar__chart" viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${cx}, ${cy})`}>{[quads, blips, labels]}</g>
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
