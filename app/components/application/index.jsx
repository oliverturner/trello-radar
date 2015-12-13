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
    console.log('onSearchChange', query)
    this.props.dispatch(searchCards(query))
  }

  render () {
    if (this.props.cardHovered) {
      window.location.hash = this.props.cardHovered
    }

    return (
      <div className="radar">
        <Chart {...this.props} />
        <div className="radar__nav">
          <Search onChange={this.onSearchChange}/>
          <Nav quadrants={this.props.quadrants}/>
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  dispatch:    PropTypes.func.isRequired,
  quadrants:   PropTypes.array.isRequired,
  cardHovered: PropTypes.string
}

const select = (state) => state

export default connect(select)(Application)
