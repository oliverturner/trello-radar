import React from 'react'
import Collapse from 'react-collapse'

import Card from './card'

import styles from './style.scss'

const getQuadrant = (opened, q, qCards) => {
  if (!opened) return false

  return (
    <li key={q.id} id={q.id} className={styles['quadrant']}>
      <p className={styles['quadrant__label']}>{q.name}</p>
      <ul className={styles['quadrant__cards']}>
        {qCards.map((c) => <Card key={c.id} {...c} />)}
      </ul>
    </li>
  )
}

const Nav = ({quadrants, cards}) =>
  <ul className={styles.quadrants}>
    {quadrants.map((q) => {
      const qCards = cards.filter((c) => c.quadrantId === q.id)
      const opened = (qCards.every((c) => c.displayed === false))

      return getQuadrant(!opened, q, qCards)
    })}
  </ul>

export default Nav
