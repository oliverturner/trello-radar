import React from 'react'

import QuadrantList from './quadrant-list'

import styles from './style.scss'

const Nav = ({quadrants}) => {
  const getQuadList = (q) => {
    return (
      <li key={q.id} className={styles['subitems']}>
        <p className={styles['subitem__label']}>{q.name}</p>
        <QuadrantList cards={q.cards}/>
      </li>
    )
  }

  return (
    <ul className={styles.items}>
      {quadrants.map(getQuadList)}
    </ul>
  )
}

export default Nav
