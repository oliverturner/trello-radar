import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class QuadrantLabel extends Component {
  render () {
    const {horizonWidth, horizonNum, innerRad, textAngle} = this.props.metrics

    const dx = horizonWidth / (horizonNum - innerRad)
    const t  = `rotate(${this.props.index * textAngle + textAngle})`
    return (
      <text className="quadrant" dx={dx} transform={t}>{this.props.name}</text>
    )
  }
}

QuadrantLabel.propTypes = {
  index: PropTypes.number.isRequired,
  name:  PropTypes.string.isRequired,

  metrics: PropTypes.shape({
    innerRad:     PropTypes.number,
    horizonNum:   PropTypes.number,
    horizonWidth: PropTypes.number,
    textAngle:    PropTypes.number
  }).isRequired
}

function select (state) {
  return {metrics: state.metrics}
}

export default connect(select)(QuadrantLabel)
