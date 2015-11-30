import React from 'react'

import Quadrant from './quadrant'

import styles from './style.scss'

const Nav = ({quadrants}) =>
  <ul className={styles.quadrants}>
    {quadrants.map((q) =>
      <li key={q.id} className={styles['quadrant']}>
        <div className={styles['quadrant__label']}>
          <p className={styles['quadrant__label__vert']}>{q.name}</p>
        </div>
        <Quadrant cards={q.cards}/>
      </li>
    )}
  </ul>

export default Nav
