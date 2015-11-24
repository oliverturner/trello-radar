import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import d3 from 'd3'

class Quadrant extends Component {
  arcFunction () {
    const {horizonWidth, horizonNum, quadAngle, innerRad, width} = this.props.metrics
    const {qIndex, hIndex} = this.props

    const w    = horizonNum + innerRad
    const oRad = (innerRad + hIndex + 1) / w
    const iRad = (innerRad + hIndex) / w

    return d3.svg.arc()
      .innerRadius((d) => iRad * horizonWidth)
      .outerRadius((d) => oRad * horizonWidth)
      .startAngle((d)  => qIndex * quadAngle + Math.PI / 2)
      .endAngle((d)    => (qIndex + 1) * quadAngle + Math.PI / 2)
  }

  fill () {
    const {colourScale, horizonNum} = this.props.metrics
    const rgb = d3.rgb(colourScale(this.props.qIndex))

    return rgb.brighter(this.props.hIndex / horizonNum * 3)
  }

  render () {
    const arc  = this.arcFunction()
    const fill = this.fill()

    return (
      <path d={arc()} fill={fill}/>
    )
  }
}

Quadrant.propTypes = {
  qIndex: PropTypes.number.isRequired,
  hIndex: PropTypes.number.isRequired,

  metrics: PropTypes.shape({
    width:        PropTypes.number,
    innerRad:     PropTypes.number,
    horizonNum:   PropTypes.number,
    horizonWidth: PropTypes.number,
    quadAngle:    PropTypes.number,
    colourScale:  PropTypes.func
  }).isRequired
}

function select (state) {
  return {metrics: state.metrics}
}

export default connect(select)(Quadrant)
