import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Blip from '../chart/blip'
import Quadrant from '../chart/quadrant'
import QuadrantLabel from '../chart/quadrant-label'

class Application extends Component {
  render () {
    const {width, height} = this.props.metrics
    const cx = width / 2
    const cy = height / 2

    const t  = `translate(${cx}, ${cy})`
    const vb = `0 0 ${width} ${height}`

    const sKeys  = Object.keys(this.props.segments)
    const quads  = sKeys.map((key) => <Quadrant {...this.props.segments[key]} />)
    const blips  = this.props.cards.map((b, i) => <Blip {...b} />)
    const labels = this.props.quadrants.map((q, i) =>
      <QuadrantLabel index={i} name={q.name} metrics={this.props.metrics} />
    )

    return (
      <div className="radar">
        <svg className="radar__chart" viewBox={vb}>
          <g transform={t}>{[quads, blips, labels]}</g>
        </svg>
        <div className="radar__nav">
          {this.props.quadrants.map(q =>
            <li key={q.id}>{q.name}
              <ul>
                {this.props.cards
                  .filter((c) => c.idLabels[0] === q.id)
                  .map((c) => <li key={c.id}>
                    {c.name}
                    <p>{c.description}</p>
                  </li>)
                }
              </ul>
            </li>
          )}
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  metrics: PropTypes.shape({
    width:  PropTypes.number,
    height: PropTypes.number
  }).isRequired,

  segments:  PropTypes.object.isRequired,
  quadrants: PropTypes.array.isRequired,
  cards:     PropTypes.array.isRequired
}

function select (state) {
  return {...state}
}

export default connect(select)(Application)
