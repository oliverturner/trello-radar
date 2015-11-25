import React, {PropTypes} from 'react'

import metrics from '../../utils/metrics'

const QuadrantLabel = ({index, name}) => {
  const t  = `rotate(${index * metrics.textAngle + metrics.textAngle})`

  return (
    <text className="quadrant" dx={metrics.labelDX} transform={t}>{name}</text>
  )
}

export default QuadrantLabel
