import React from 'react'

import QuadrantList from './quadrant-list'

const Nav = ({quadrants}) => {
  const getQuadList = (q) => {
    return (
      <li key={q.id} className="navitem">
        <p className="navitem__label">{q.name}</p>
        <QuadrantList cards={q.cards}/>
      </li>
    )
  }

  return (
    <ul className="navitems">
      {quadrants.map(getQuadList)}
    </ul>
  )
}

export default Nav
