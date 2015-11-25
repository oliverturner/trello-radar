import React, {PropTypes} from 'react'

const QuadrantLabel = ({index, name, metrics}) => {
  const {horizonWidth, horizonNum, innerRad, textAngle} = metrics

  const dx = horizonWidth / (horizonNum - innerRad)
  const t  = `rotate(${index * textAngle + textAngle})`

  return (
    <text className="quadrant" dx={dx} transform={t}>{name}</text>
  )
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

export default QuadrantLabel
