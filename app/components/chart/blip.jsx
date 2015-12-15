import React from 'react'

import metrics from '../../utils/metrics'

import styles from './style.scss'

const Blip = ({id, sCount, sIndex, quadrantId, horizonId, qIndex, hIndex, name, blipClick, blipHover, displayed = true}) => {
  if (!displayed) return false

  const r     = metrics.getBlipRadius(sCount, sIndex, hIndex)
  const theta = metrics.getBlipTheta(sCount, sIndex, qIndex)
  const [x, y] = metrics.polarToCartesian(r, theta)

  return (
    <g className={styles['blip']} transform={`translate(${x}, ${y})`}
       onMouseOver={() => blipHover(id, quadrantId, horizonId)}
       onMouseOut={() => blipHover()}
       onClick={() => blipClick(id)}>
      <circle r="2px"/>
      <text className={styles['blip__name']}>{
        name.split(' ').map((word, i) => <tspan key={`${id}-${i}`} x="0" dy={10}>{word}</tspan>)
      }</text>
    </g>
  )
}

export default Blip
