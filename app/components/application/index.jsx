import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Chart from '../chart'
import Nav from '../nav'

import '../../styles/base.scss'

class Application extends Component {
  render () {
    if (this.props.cardHovered) {
      window.location.hash = this.props.cardHovered.quadrantId
    }

    return (
      <div className="radar">
        <Chart {...this.props} />
        <div className="radar__nav">
          <Nav quadrants={this.props.quadrants}/>
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  quadrants:   PropTypes.array.isRequired,
  cardHovered: PropTypes.object
}

const select = (state) => state

export default connect(select)(Application)
