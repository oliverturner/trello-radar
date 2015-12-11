import React from 'react'

const Segment = ({horizonId, onHover, ...props}) => {
  return <path {...props}
               onMouseEnter={() => onHover(horizonId)}
               onMouseLeave={() => onHover()}/>
}

export default Segment
