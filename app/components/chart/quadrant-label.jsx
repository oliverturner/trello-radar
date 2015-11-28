import React from 'react'

import metrics from '../../utils/metrics'

import styles from './style.scss'

const QuadrantLabel = ({name, arcId}) => {
  const path = `<textPath xlink:href="#${arcId}">${name}</textPath>`

  // TODO: fix magic dx value
  return (
    <text className={styles['quadrantlabel']} dx="250" dy="-5" dangerouslySetInnerHTML={{__html: path }} />
  )
}

export default QuadrantLabel
