import React from 'react'

import metrics from '../../utils/metrics'

import styles from './style.scss'

export default ({name, arcId}) => {
  // Crashes Firefox! @see https://bugzilla.mozilla.org/show_bug.cgi?id=1067695
  const path = `<textPath xlink:href="#${arcId}">${name}</textPath>`
  const dx   = (Math.PI * metrics.horizonWidth * 2) / (metrics.quadNum * 2)
  const dy   = -6

  return (
    <text className={styles['quadrantlabel']} dx={dx} dy={dy} dangerouslySetInnerHTML={{__html: path }}/>
  )
}
