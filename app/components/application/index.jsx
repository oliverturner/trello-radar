import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {searchCards} from '../../actions/trello'

import Chart from '../chart'
import Search from '../search'
import Nav from '../nav'

import '../../styles/base.scss'

class Application extends Component {
  onSearchChange = (event) => {
    const query = event.currentTarget.query.value
    this.props.dispatch(searchCards(query))
  }

  onSearchReset = () => {
    this.props.dispatch({type: 'CARDS_FILTER_RESET'})
  }

  render () {
    if (this.props.quadrantSelected) {
      window.location.hash = this.props.quadrantSelected
    }

    return (
      <div className="radar">
        <Chart {...this.props} />
        <div className="radar__nav">
          <Search onChange={this.onSearchChange} onReset={this.onSearchReset}/>
          <Nav quadrants={this.props.quadrants} cards={this.props.cards}/>
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  dispatch:         PropTypes.func.isRequired,
  quadrants:        PropTypes.array.isRequired,
  cards:            PropTypes.array.isRequired,
  cardHovered:      PropTypes.string,
  quadrantSelected: PropTypes.string
}

// TODO: split out into more granular reqs: don't simply convert to JS
// see https://github.com/rackt/react-redux/issues/60
const select = (state) => {
  return {
    segments:     state.get('segments').toObject(),
    segmentCards: state.get('segmentCards').toArray(),
    quadrants:    state.get('quadrants').toArray(),
    horizons:     state.get('horizons').toArray(),
    cards:        state.get('cards').toArray(),

    textPathSupported: state.get('textPathSupported'),
    quadrantSelected:  state.get('quadrantSelected'),
    horizonSelected:   state.get('horizonSelected'),
    cardHovered:       state.get('cardHovered')
  }
}

export default connect(select)(Application)
