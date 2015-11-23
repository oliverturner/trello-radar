import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

function polarToCartesian (r, t) {
  var x = r * Math.cos(t)
  var y = r * Math.sin(t)
  return [x, y]
}

class Blip extends Component {
  calcRad () {
    const {innerRad, horizonNum, horizonWidth} = this.props.metrics
    const min = this.props.horizon + innerRad
    const max = horizonNum + innerRad

    return min / max * horizonWidth
  }

  getRadius () {
    const ry = this.props.metrics.horizonUnit / 2
    const dy = ry / 2

    let stagger = 0
    if (this.props.keyNum > this.props.horizon + 1) {
      stagger = this.props.keyIndex % 2 ? dy : -dy
    }

    return this.calcRad() + ry + stagger
  }

  getXY () {
    const q = this.props.metrics.quadAngle
    const r = this.getRadius()

    const posAngle  = (1 / (this.props.keyNum + 1)) * (this.props.keyIndex + 1)
    const quadDelta = q * this.props.quadrant
    const theta     = (posAngle * q) + quadDelta

    return polarToCartesian(r, theta)
  }

  render () {
    const [x, y] = this.getXY()
    const t = `translate(${x}, ${y})`

    return (
      <g className="blip" transform={t}>
        <circle r="7px"/>
        <text className="name" dy="20px">{this.props.name}</text>
      </g>
    )
  }
}

Blip.propTypes = {
  metrics: PropTypes.shape({
    innerRad:     PropTypes.number,
    quadAngle:    PropTypes.number,
    horizonNum:   PropTypes.number,
    horizonWidth: PropTypes.number,
    horizonUnit:  PropTypes.number
  }).isRequired,

  keyIndex: PropTypes.number.isRequired,
  keyNum:   PropTypes.number.isRequired,
  horizon:  PropTypes.number.isRequired,
  quadrant: PropTypes.number.isRequired
}

function select (state) {
  return {metrics: state.metrics}
}

export default connect(select)(Blip)
