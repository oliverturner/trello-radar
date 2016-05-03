import React from 'react'

import styles from './styles.pcss'

export default function () {
  const getHorizons = (n) =>
    Array.from(Array(n)).map((_, i) => (
      <circle className={styles['proto--horizon']} r={300 - (i * 60)} />
    ))

  const getLines = (n) =>
    Array.from(Array(n)).map((_, i) => {
      const y = (i + 1) * -60
      return (
        <line className={styles['proto--line']} x1="0" x2="400" y1={y} y2={y} />
      )
    })

  return (
    <div className={styles['radar']}>
      <svg className={styles['radar__chart']} viewBox="0 0 800 600">
        <g transform="translate(400, 300)">
          {getHorizons(5)}
          {getLines(5)}
        </g>
      </svg>
      <div className={styles['radar__nav']} />
    </div>
  )
}
