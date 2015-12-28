import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Blip from './blip'

class Blips extends Component {
  blipClick = (cardId) => {
    this.props.dispatch({type: 'CARD_SELECT', cardId})
  }

  blipHover = (cardId, quadrantId, horizonId) => {
    this.props.dispatch({type: 'CARD_HOVER', cardId, quadrantId, horizonId})
  }

  shouldComponentUpdate (nextProps) {
    return this.props.segmentCards !== nextProps.segmentCards
  }

  render () {
    const blips = this.props.segmentCards.map((c) => {
      const data = c.toObject()

      return <Blip key={data.id} {...data} blipClick={this.blipClick} blipHover={this.blipHover}/>
    })

    return (<g>{blips.toArray()}</g>)
  }
}

Blips.propTypes = {
  dispatch: PropTypes.func.isRequired,

  segmentCards: PropTypes.object.isRequired
}

function select (state) {
  return {
    segmentCards: state.chart.get('segmentCards')
  }
}

export default connect(select)(Blips)
