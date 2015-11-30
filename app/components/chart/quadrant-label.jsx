import React from 'react'

import metrics from '../../utils/metrics'

import styles from './style.scss'

const QuadrantLabel = ({name, arcId}) => {
  const path = `<textPath xlink:href="#${arcId}">${name}</textPath>`
  const dx   = (Math.PI * metrics.horizonWidth * 2) / (metrics.quadNum * 2)
  const dy   = -15

  return (
    <text className={styles['quadrantlabel']} dx={dx} dy={dy} dangerouslySetInnerHTML={{__html: path }}/>
  )
}

export default QuadrantLabel
