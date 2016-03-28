import React, {PropTypes} from 'react'

import metrics from '../../../utils/metrics'

import styles from '../style.scss'

const HorizonLabel = ({index, name, selected}) => {
  const y   = metrics.getHorizonRad(index) * -1
  const dy  = metrics.horizonWidths[index] * -0.5
  const cls = selected ? 'horizonlabel--active' : 'horizonlabel'

  return (
    <text className={styles[cls]} x="400" y={y} dy={dy}>{name}</text>
  )
}

HorizonLabel.propTypes = {
  index:    PropTypes.number.isRequired,
  name:     PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired
}

export default HorizonLabel
