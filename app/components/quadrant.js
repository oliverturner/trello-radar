import React, {Component, PropTypes} from 'react'
import d3 from 'd3'

class Quadrant extends Component {
  arcFunction () {
    const w = this.props.metrics.horizonWidth

    return d3.svg.arc()
      .innerRadius((d) => this.props.innerRadius * w)
      .outerRadius((d) => this.props.outerRadius * w)
      .startAngle((d)  => this.props.index * this.props.metrics.quadAngle + Math.PI / 2)
      .endAngle((d)    => (this.props.index + 1) * this.props.metrics.quadAngle + Math.PI / 2)
  }

  fill () {
    const hue = d3.scale.category10()
    const rgb = d3.rgb(hue(this.props.index))

    return rgb.brighter(this.props.index / this.props.metrics.horizonNum * 3)
  }

  render () {
    const cls  = 'quadrant quadrant--' + this.props.name.toLowerCase().replace(/ /, '-')
    const arc  = this.arcFunction()
    const fill = this.fill()

    return (
      <path className={cls} d={arc()} fill={fill}/>
    )
  }
}

Quadrant.propTypes = {
  name:        PropTypes.string,
  index:       PropTypes.number.isRequired,
  innerRadius: PropTypes.number.isRequired,
  outerRadius: PropTypes.number.isRequired,

  metrics: PropTypes.shape({
    horizonNum:   PropTypes.number,
    horizonWidth: PropTypes.number,
    quadAngle:    PropTypes.number
  }).isRequired
}

export default Quadrant
