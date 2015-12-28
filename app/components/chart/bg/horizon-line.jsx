import React from 'react'

import metrics from '../../../utils/metrics'

const HorizonLine = ({index}) => {
  const y = metrics.getHorizonRad(index) * -1

  return <line className="proto" x1="0" x2="400" y1={y} y2={y} />
}

export default HorizonLine
