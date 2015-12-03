import React from 'react'

import metrics from '../../utils/metrics'

import styles from './style.scss'

const Blip = ({id, sCount, sIndex, quadrantId, horizonId, qIndex, hIndex, name, blipClick, blipHover}) => {
  const r      = metrics.getBlipRadius(sCount, sIndex, hIndex)
  const theta  = metrics.getBlipTheta(sCount, sIndex, qIndex)
  const [x, y] = metrics.polarToCartesian(r, theta)

  const t = `translate(${x}, ${y})`

  return (
    <g className={styles['blip']} transform={t}
       onMouseOver={blipHover.bind(null, id, quadrantId, horizonId)}
       onMouseOut={blipHover.bind(null, null, null, null)}
       onClick={blipClick.bind(null, id)}>
      <circle r="3px" />
      <text className={styles['blip__name']}>{
        name.split(' ').map((word, i) => <tspan key={`${id}-${i}`} x="0" dy={i > 0 ? 12 : 15}>{word}</tspan>)
      }</text>
    </g>
  )
}

export default Blip
