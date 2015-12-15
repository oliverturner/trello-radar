import React from 'react'

import Card from './card'

import styles from './style.scss'

const Nav = ({quadrants, cards}) =>
  <ul className={styles.quadrants}>
    {quadrants.map((q) =>
      <li key={q.id} id={q.id} className={styles['quadrant']}>
        <div className={styles['quadrant__label']}>
          <p className={styles['quadrant__label__vert']}>{q.name}</p>
        </div>
        <ul className={styles['quadrant__cards']}>
          {cards.filter((c) => c.quadrantId === q.id).map((c) => <Card key={c.id} {...c} />)}
        </ul>
      </li>
    )}
  </ul>

export default Nav
