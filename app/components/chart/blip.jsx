import React from 'react'

import metrics from '../../utils/metrics'

import styles from './style.scss'

const Blip = ({id, sCount, sIndex, qIndex, hIndex, name, blipClick, blipHover}) => {
  const r      = metrics.getBlipRadius(sCount, sIndex, hIndex)
  const theta  = metrics.getBlipTheta(sCount, sIndex, qIndex)
  const [x, y] = metrics.polarToCartesian(r, theta)

  const t = `translate(${x}, ${y})`

  return (
    <g className={styles['blip']} transform={t}
       onMouseOver={blipHover.bind(null, id)}
       onMouseOut={blipHover.bind(null, null)}
       onClick={blipClick.bind(null, id)}>
      <circle r="5px" />
      <text className={styles['name']} dy="15px">{name}</text>
    </g>
  )
}

export default Blip
