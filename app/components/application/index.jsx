import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Chart from '../chart'
import Nav from '../nav'

class Application extends Component {
  render () {
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
  quadrants: PropTypes.array.isRequired
}

function select (state) {
  return {...state}
}

export default connect(select)(Application)
