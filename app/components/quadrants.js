import React, {Component, PropTypes} from 'react'

class Quadrants extends Component {

  render () {
    return (
      <g transform={this.props.transform} className="quadrants">
        {this.props.children}
      </g>
    )
  }
}

export default Quadrants
