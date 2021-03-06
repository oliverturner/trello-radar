import React, {PropTypes} from 'react'

import metrics from '../../../utils/metrics'

import styles from './styles.pcss'

const HorizonLine = ({index}) => {
  const y = metrics.getHorizonRad(index) * -1

  return <line className={styles['proto']} x1="0" x2="400" y1={y} y2={y} />
}

HorizonLine.propTypes = {
  index: PropTypes.number.isRequired
}

export default HorizonLine
