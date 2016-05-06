import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Blip from './blip'

class Blips extends Component {
  constructor (props) {
    super(props)

    this.blipClick = ({id, quadrantId, horizonId}) => () => {
      this.props.dispatch({type: 'CARD_SELECT', payload: {cardId: id, quadrantId, horizonId}})
    }

    this.blipHover = ({id, quadrantId, horizonId}) => () => {
      this.props.dispatch({type: 'CARD_HOVER', payload: {cardId: id, quadrantId, horizonId}})
    }

    this.blipLeave = () => () => {
      this.props.dispatch({type: 'CARD_HOVER', payload: {}})
    }
  }

  shouldComponentUpdate (nextProps) {
    return this.props.segmentCards !== nextProps.segmentCards
  }

  render () {
    const blips = this.props.segmentCards.map((c) => {
      const data = c.toObject()

      return (
        <Blip key={data.id} {...data}
          blipClick={this.blipClick(data)}
          blipHover={this.blipHover(data)}
          blipLeave={this.blipLeave()} />
      )
    }).toArray()

    return (<g>{blips}</g>)
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
