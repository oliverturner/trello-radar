import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import metrics from '../../utils/metrics'

import Blip from '../chart/blip'
import Quadrant from '../chart/quadrant'
import QuadrantLabel from '../chart/quadrant-label'
import Nav from '../nav'

class Application extends Component {
  blipClick = (blipId) => {
    this.props.dispatch({type: 'CARD_SELECT', cardId: blipId})
  }

  render () {
    const {width, height} = metrics
    const cx = width / 2
    const cy = height / 2

    const t  = `translate(${cx}, ${cy})`
    const vb = `0 0 ${width} ${height}`

    const sKeys = Object.keys(this.props.segments)
    const quads = sKeys.map((key) =>
      <Quadrant {...this.props.segments[key]} />
    )

    const blips = this.props.cards.map((c, i) => <Blip {...c} blipClick={this.blipClick} />)

    const labels = this.props.quadrants.map((q, i) =>
      <QuadrantLabel index={i} name={q.name}/>
    )

    return (
      <div className="radar">
        <svg className="radar__chart" viewBox={vb}>
          <g transform={t}>{[quads, blips, labels]}</g>
        </svg>
        <div className="radar__nav">
          <Nav quadrants={this.props.quadrants}/>
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  dispatch: PropTypes.func.isRequired,

  segments:  PropTypes.object.isRequired,
  quadrants: PropTypes.array.isRequired,
  cards:     PropTypes.array.isRequired
}

function select (state) {
  return {...state}
}

export default connect(select)(Application)
