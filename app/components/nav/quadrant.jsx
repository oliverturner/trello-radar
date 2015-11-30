import React from 'react'

import Card from './card'

import styles from './style.scss'

const Quadrant = ({cards}) =>
  <ul className={styles['quadrant__cards']}>
    {cards.map((c) => <Card key={c.id} {...c} />)}
  </ul>

export default Quadrant
