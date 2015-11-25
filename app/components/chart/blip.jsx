import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

const polarToCartesian = (r, t) => {
  var x = r * Math.cos(t)
  var y = r * Math.sin(t)
  return [x, y]
}

class Blip extends Component {
  calcRad () {
    const {innerRad, horizonNum, horizonWidth} = this.props.metrics
    const min = this.props.hIndex + innerRad
    const max = horizonNum + innerRad

    return min / max * horizonWidth
  }

  getRadius () {
    const ry = this.props.metrics.horizonUnit / 2
    const dy = ry / 2

    let stagger = 0
    if (this.props.sCount > this.props.hIndex + 1) {
      stagger = this.props.sIndex % 2 ? dy : -dy
    }

    return this.calcRad() + ry + stagger
  }

  getXY () {
    const q = this.props.metrics.quadAngle
    const r = this.getRadius()

    const posAngle  = (1 / (this.props.sCount + 1)) * (this.props.sIndex + 1)
    const quadDelta = q * this.props.qIndex
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

  name:   PropTypes.string.isRequired,
  sCount: PropTypes.number.isRequired,
  sIndex: PropTypes.number.isRequired,
  hIndex: PropTypes.number.isRequired,
  qIndex: PropTypes.number.isRequired
}

function select (state) {
  return {metrics: state.metrics}
}

export default connect(select)(Blip)
