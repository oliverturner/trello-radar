import React from 'react'

import metrics from '../../utils/metrics'

import styles from './style.scss'

const QuadrantLabel = ({index, name}) => {
  const t  = `rotate(${index * metrics.textAngle + metrics.textAngle})`

  return (
    <text className={styles['quadrant']}dx={metrics.labelDX} transform={t}>{name}</text>
  )
}

export default QuadrantLabel
