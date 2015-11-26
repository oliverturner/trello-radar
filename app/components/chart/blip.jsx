import React from 'react'

import metrics from '../../utils/metrics'

const Blip = ({id, sCount, sIndex, qIndex, hIndex, name, blipClick}) => {
  const r      = metrics.getBlipRadius(sCount, sIndex, hIndex)
  const theta  = metrics.getBlipTheta (sCount, sIndex, qIndex)
  const [x, y] = metrics.polarToCartesian(r, theta)

  const t = `translate(${x}, ${y})`

  return (
    <g className="blip" transform={t} onClick={blipClick.bind(null, id)}>
      <circle r="5px" />
      <text className="name" dy="15px">{name}</text>
    </g>
  )
}

export default Blip
