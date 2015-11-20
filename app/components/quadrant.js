import React, {Component, PropTypes} from 'react'
import d3 from 'd3'

class Quadrant extends Component {
  arcFunction () {
    const w = this.props.metrics.horizonWidth

    return d3.svg.arc()
      .innerRadius((d) => d.innerRadius * w)
      .outerRadius((d) => d.outerRadius * w)
      .startAngle((d)  => d.index * this.props.metrics.quadAngle + Math.PI / 2)
      .endAngle((d)    => (d.index + 1) * this.props.metrics.quadAngle + Math.PI / 2)
  }

  fill () {
    const hue = d3.scale.category10()
    const rgb = d3.rgb(hue(this.props.quadrant.index))

    return rgb.brighter(this.props.quadrant.index / this.props.metrics.horizonNum * 3)
  }

  render () {
    const cls  = 'quadrant quadrant--' + this.props.name.toLowerCase().replace(/ /, '-')
    const arc  = this.arcFunction()(this.props.quadrant)
    const fill = this.fill()

    return (
      <path className={cls} d={arc} fill={fill}/>
    )
  }
}

Quadrant.defaultProps = {
  name: 'foo',

  quadrant: {
    innerRadius: 0.5,
    outerRadius: 0.7,
    index:       1
  },

  metrics: {
    horizonNum:   5,
    horizonWidth: 285,
    quadAngle:    1.256
  }
}

Quadrant.propTypes = {
  name: PropTypes.string,

  quadrant: PropTypes.shape({
    index:       PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number
  }).isRequired,

  metrics: PropTypes.shape({
    horizonNum:   PropTypes.number,
    horizonWidth: PropTypes.number,
    quadAngle:    PropTypes.number
  }).isRequired
}

export default Quadrant
