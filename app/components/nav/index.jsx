import React from 'react'

import Quadrant from './quadrant'

import styles from './style.scss'

const Nav = ({quadrants}) =>
  <ul className={styles.quadrants}>
    {quadrants.map((q) =>
      <li key={q.id} className={styles['quadrant']}>
        <p className={styles['quadrant__label']}>{q.name}</p>
        <Quadrant cards={q.cards}/>
      </li>
    )}
  </ul>

export default Nav
