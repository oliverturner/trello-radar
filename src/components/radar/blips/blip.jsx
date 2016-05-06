import React, {PropTypes} from 'react'

import metrics from 'utils/metrics'

import styles from './styles.pcss'

const Blip = ({id, sCount, sIndex, qIndex, hIndex, name, blipClick, blipHover, blipLeave, displayed = true}) => {
  if (!displayed) return (<g />)

  const r      = metrics.getBlipRadius(sCount, sIndex, hIndex)
  const theta  = metrics.getBlipTheta(sCount, sIndex, qIndex)
  const [x, y] = metrics.polarToCartesian(r, theta)

  return (
    <g className={styles['blip']} transform={`translate(${x}, ${y})`}
      onMouseOver={blipHover}
      onMouseOut={blipLeave}
      onClick={blipClick}>
      <circle r="2px" />
      <text className={styles['blip__name']}>{
        name.split(' ').map((word, i) =>
          <tspan key={`${id}-${i}`} x="0" dy={10}>{word}</tspan>
        )
      }</text>
    </g>
  )
}

Blip.propTypes = {
  id:         PropTypes.string.isRequired,
  sCount:     PropTypes.number.isRequired,
  sIndex:     PropTypes.number.isRequired,
  qIndex:     PropTypes.number.isRequired,
  hIndex:     PropTypes.number.isRequired,
  name:       PropTypes.string.isRequired,
  blipClick:  PropTypes.func.isRequired,
  blipHover:  PropTypes.func.isRequired,
  blipLeave:  PropTypes.func.isRequired,
  displayed:  PropTypes.bool.isRequired
}

export default Blip
